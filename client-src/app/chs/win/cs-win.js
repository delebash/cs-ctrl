import {ViewSlot, customElement, bindable} from 'aurelia-framework';
import {EventAggregator}                   from 'aurelia-event-aggregator';
import {WinController}                     from './win-controller';
import {WinSvc}                            from './win-svc';
import {Resizable}                         from '../resizable';
import {Draggable}                         from '../draggable';
import {docOffset, transitionEndEvent, getTabbables, getSiblings} from '../chs';

var _modalOverlayCount = 0;


@customElement('cs-win')
export class CsWin
{
    @bindable title     = '';   //Window title
    @bindable ico       = '';   //CSS class for icon
    
    static defaultOps =
    {
        appendTo      : 'desktop',            //Element id of the node windows are appended to when created
        width         : 400,
        height        : 200,
        minWidth      : 400,
        minHeight     : 200,
        maxHeight     : 0,
        maxWidth      : 0,
        
        resizable     : false,
        solo          : false,
        modal         : false,
        
        canMinimize   : true,
        closeOnEscape : true,
        position      : 'center'              //Position to open the dialog at
    };

    static event =                            //Window event strings
    {
        closed:  'cswin:closed'               //Window has closed
    };

    static inject = [Element, WinController, WinSvc, EventAggregator];
    constructor(el, winController, winSvc, eventAggregator)
    {
        var self              = this;
        self.element          = el;  
        self.eventAggregator  = eventAggregator;  //Publish/subscribe event service
        self.winController    = winController;    //Store instance of the WinController that glues everything together
        winController.csWin   = self;             //Give access to this Window control via the WinController class
        self.busyTxt          = '';               //Text to show in status bar when window is working...
        
        //self.winID            = chsID();          //Assign an ID to this window
        self.showContent      = true;             //Should the window content be visible?
        self.blockContentFlag = false;            //Show an overlay blocking interaction with the window's content?
        self.winSvc           = winSvc;           //Window service (Used by view)
        self.self             = self;             //(Used by view)
        
        
        //Set default options
        var ops = Object.assign({}, CsWin.defaultOps);
        
        //Set view options
        setNumberPropsFromAttrArray(ops, ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'], el);
        if(el.hasAttribute('solo'))      { ops.solo      = true; }
        if(el.hasAttribute('modal'))     { ops.modal     = true; }
        if(el.hasAttribute('resizable')) { ops.resizable = true; }
        
        //Set override options from caller
        self.ops = Object.assign(ops, winController.options);

        //Element holding the window
        self.parentEl   = document.getElementById(ops.appendTo);              

        //Size window
        var style       = el.style;
        style.width     = ops.width     + 'px';
        style.height    = ops.height    + 'px';
        style.minWidth  = ops.minWidth  + 'px';
        style.minHeight = ops.minHeight + 'px';
        if(ops.maxWidth)  { style.maxWidth  = ops.maxWidth  + 'px'; }
        if(ops.maxHeight) { style.maxHeight = ops.maxHeight + 'px'; }
    }
    
    
    
    //Life Cycle
    //-----------------------------------------------------------------------------
    addToDom()
    {
        //Called by winSvc and runs before attached
        var self = this, wCtrl = self.winController;
        
        wCtrl.slot = new ViewSlot(self.parentEl, true);  //anchor, anchorIsContainer, executionContext, animator
        wCtrl.slot.add(wCtrl.view);
        wCtrl.slot.attached();
    }
    attached()
    {
        var self = this;
        self.contentEl = self.element.getElementsByClassName('cs-win-content')[0];     //Div holding the window content
        self.makeDraggable(true);
        self.makeResizable(true);
        self.position();                                //Set window's initial position
        self.createModalOverlay();                      //Creates an overlay to block the content behind the window if it is modal
        self.moveToTop();                               //Make this the topmost window
        
        if (self.modalOverlayEl)
        {
            self.modalOverlayEl.style.zIndex = self.element.style.zIndex - 1;
        }
        
        self.focusTabbable();                           //Set focus on 1st tabbable element
        self.open();
    }
    unbind()
    {
        this.dispose();
    }
    
    
    dispose()
    {
        var self = this, parent = self.parentEl, el = self.element, winCtrl = self.winController;
        
        if(!self.DEAD)
        {
            self.DEAD = true;
            
            //Remove modal overlay if present
            self.destroyModalOverlay();
            
            //Dispose of draggable/resizable
            self.makeDraggable(false);
            self.makeResizable(false);
            
            //Remove comment <view> tags that wrap cs-win
            parent.removeChild(el.previousSibling);
            parent.removeChild(el.nextSibling);
            
            //Remove cs-win
            parent.removeChild(el);
            
            //Trigger detached/unbind
            winCtrl.slot.detached();
            winCtrl.controller.unbind();
        }
    }
    
    
    makeDraggable(b)
    {
        var self = this, winEl = self.element;
        if(b)
        {
            self.draggable = new Draggable(
            {
                element: winEl,
                handle : winEl.children[0].children[0], //.cs-win-draggable
                onStart: () =>
                {
                    self.lastFocusEl = document.activeElement;               //Record where focus had been so we can restore it after drag
                    self.showContent = false;

                    //if (this.windowMode === WindowMode.Maximized)          //...also dragging a maximized window should restore it to normal mode
                    //{
                    //    this.restoreWin(true, false);                      //Restore size but not position since we are dragging
                    //}
                },
                onEnd: (event, dragEl, dragOps) =>
                {
                    self.showContent = true;

                    var top, left;
                    var offset = docOffset(winEl);                      //Gets current coordinates relative to the document
                    var ch     = window.innerHeight - 27;               //The container height minus aprox dialog titlebar height (how much we want to reamin visible if dragging below the desktop)
                    var cw     = window.innerWidth  - 60;               //The container width - the amount we want to make sure is always visible from the right of the screen

                         if (offset.top < 0)   { top = "0px";     }     //Prevent dragging above top of screen
                    else if (offset.top > ch)  { top = ch + "px"; }     //Prevent dragging below this point

                         if (offset.left > cw) { left = cw + "px";}     //Prevent dragging further to the right than this
                    else if (offset.left < 0)                           //If offscreen to the left
                    {
                        if ((offset.left + winEl.offsetWidth) < 150)    //If < 150 px is visible from the left, pull window on screen
                        {
                            left = "0px";
                        }
                    }

                    self.restoreFocus();
                    
                    //Apply positioning
                    requestAnimationFrame(() => 
                    { 
                        if(left) {winEl.style.left = left;}
                        if(top)  {winEl.style.top  = top; }
                    });

                    //self.tellAboutResize();    //In case restore occured, I think content needs to be visible for some elements to resize correctly
                },
            });
        }
        else { self.draggable.dispose(); }
    }
    
    makeResizable(b)
    {
        var self = this, winEl = self.element;
        if(!self.ops.resizable) { return; } 
        
        if(b)
        {
            self.resizable = new Resizable(
            {
                element: winEl,
                handle : winEl.children[2], //.cs-win-rsz
                onStart: () => { self.lastFocusEl = document.activeElement; }, //Record where focus had been so we can restore it after resize
                onEnd:   () => { self.restoreFocus(); }
            });
        }
        else { self.resizable.dispose(); }
    }
    
    restoreFocus()   //Return focus to the window's last focused element or the 1st tabbable
    {
        var self = this;
        setTimeout(() =>
        {
            if(self.lastFocusEl) { self.lastFocusEl.focus(); }
            else                 { self.focusTabbable();     }
        });
    }
    
    focusTabbable()
    {
        //Try to focus on 1st element w/ autofocus
        var self = this;
        var focusEl = self.contentEl.querySelector("[autofocus]");
        if(focusEl) { focusEl.focus(); return; }

        //Try to find any tabbable element within the content...
        var tabs = getTabbables(self.contentEl);
        if(tabs.length) { tabs[0].focus(); return; }

        //Focus on window as a last resort
        self.element.focus();
    }
    
    
    close()
    {
        var self = this, el = self.element, style = el.style;
        
        //Setup close animation
        style.opacity   = 0;
        style.transform = "scale(.85)";
        self.enableAnimation(true);

        //Setup animation end handler
        el.addEventListener(transitionEndEvent, onTransitionEnd);
        function onTransitionEnd(e)
        {
            if(e.target !== el) { return; }
            el.removeEventListener(transitionEndEvent, onTransitionEnd);
            self.eventAggregator.publish(CsWin.event.closed, self);   //Notify anyone who cares that the window closed
            self.dispose();
            self.enableAnimation(false);
        }

        return true;     //Window closed
    }
    
    cancel(forceClose)         //Attempts to close the window. Used by window's X button.
    {
        var vm = this.winController.viewModel;

        //If the content VM has a windowClosing() call it
        if(vm.windowClosing)
        {
            var shouldClose = vm.windowClosing(this);                  //Does this function think it's OK for window to close?
            if (!forceClose && shouldClose===false) { return false; }  //If the VM returns false, window should not close, unless we're forcing a close.
        }
        
        //OK to close if here
        this.winController.cancel();   //Reject's result promise and calls close on this window
    }
   
    
    //Runs the window's open animation & notifies VM the window is shown
    open()
    {
        var self = this, el = self.element, style = el.style, vm = self.winController.viewModel;

        //Setup initial state for open animation
        style.opacity   = .2;
        style.transform = "scale(.85)";
        
        //Transition to this:
        setTimeout(() =>
        {
            style.opacity   = 1;
            style.transform = 'none';
            self.enableAnimation(true);
        });
        
        //Setup animation end handler
        el.addEventListener(transitionEndEvent, onTransitionEnd);
        function onTransitionEnd(e)
        {
            if(e.target !== el) { return; }
            el.removeEventListener(transitionEndEvent, onTransitionEnd);
            
            self.busy();
            if(vm.windowShown) { vm.windowShown(self); }  //Call windowShown() on VM if present
            
            self.enableAnimation(false);
        }
    }
    
    enableAnimation(b)
    {
        var classList = this.element.classList, cssAnim = 'cs-win-animate', cssNoIO = 'cs-no-io';

        if(b)
        {
            classList.add(cssAnim);
            classList.add(cssNoIO);
        }
        else
        {
            classList.remove(cssAnim);
            classList.remove(cssNoIO);
        }
    }
    
    //Block/unblock user interaction with the window's content
    blockContent(b)
    {
        var self = this, DISABLED_KEY= "data-cswinblocked";

        if(self.blockContentFlag === b) { return; }  //Don't block multiple times

        var inputs = self.contentEl.querySelectorAll('input,button,textarea'), i = 0,  inputLength = inputs.length;
         
        self.blockContentFlag = b;

        if(b)   //Disable any enabled controls
        {
            for (; i < inputLength; i++)
            {
                if(!inputs[i].disabled)
                {
                    inputs[i].disabled = b;
                    inputs[i].setAttribute(DISABLED_KEY, b);      //Mark that this ctrl was disabled by us
                }
            }
        }
        else  //Enable controls we disabled
        {
            for (; i < inputLength; i++)
            {
                if(inputs[i].getAttribute(DISABLED_KEY))
                {
                    inputs[i].disabled = b;
                    inputs[i].removeAttribute(DISABLED_KEY);
                }
            }
            self.restoreFocus();
        }
    }    

    //Convenience method for setting status text and blocking window content from user interaction
    busy(msg = "Loading...")
    {
        this.busyTxt = msg;
        this.blockContent(true);
    }

    //Convenience method for clearing busy text and removing any content block on the window
    ready()
    {
        var self = this;
        self.blockContent(false);
        self.busyTxt = "";
        self.focusTabbable(); 
    }


    position()
    {
        var winEl = this.element;

        //Center window
        var left = (window.innerWidth/2)  - (winEl.offsetWidth/2);
        var top  = (window.innerHeight/2) - (winEl.offsetHeight/2);

        winEl.style.top  = top  + "px";
        winEl.style.left = left + "px";
    }
    
    
    //Moves this window above any others in the z-order
    moveToTop()
    {
        //One option is to insert siblings before this window, but that causes iFrames to reload :(
        //So let's try just modifying z-order which preserves iFrames. Unfortuantely scroll position still resets if z-index is changed :(
        //So we  must compensate for that as well.
        var self = this, winStyle = self.element.style, curZ = winStyle.zIndex, maxZ = 1, z, i = 0;

        var windows = getSiblings(self.element, (el) =>
        {
            return (el.nodeType === 1 && el.classList.contains("cs-win"));
        });

        curZ = (curZ === "auto") ? 0 : Number(curZ);

        //Get largest z-index from the open windows
        for (; i < windows.length; i++)
        {
            z = windows[i].style.zIndex;
            z = (z === "auto") ? 0 : Number(z);

            if (z > maxZ) { maxZ = z; }
        }

        //If window's Z needs to be increased
        if(maxZ > curZ)
        {
            //Changing z-index will reset the scroll, so save it so we can restore it afterwards
            //var scrollArea = self.$content, savedScrollTop = scrollArea.scrollTop(), savedScrollLeft = scrollArea.scrollLeft();
            winStyle.zIndex = maxZ + 1;

            //setTimeout( () =>
            //{
            //    scrollArea.scrollTop(savedScrollTop).scrollLeft(savedScrollLeft);
            //}, 1);
        }
    }
    
    onKeyDown(e)
    {
        var self = this;

        //Esc
        if (e.keyCode === 27 && self.ops.closeOnEscape)
        {
            e.preventDefault();
            self.close();
            return;
        }

        //Tab (Prevent tabbing outside of the window)
        if (e.keyCode === 9)
        {
            var tabs  = getTabbables(self.contentEl), first, last, target = e.target;

            if(tabs.length)
            {
                first = tabs[0];
                last  = tabs[tabs.length - 1];
            }
            else { e.preventDefault(); return; }

            if ((target === last || target === self.winEl) && !e.shiftKey)
            {
                setTimeout( () =>
                {
                    first.focus();
                });
                e.preventDefault();
            }
            else if ((target === first || target === self.winEl) && e.shiftKey)
            {
                setTimeout( () =>
                {
                    last.focus();
                });
                e.preventDefault();
            }
        }
        return true;
    }
    
    //Creates an overlay to block the content behind the window if it is modal
    createModalOverlay()
    {
        var self = this;
        if (!self.ops.modal) { return; }


        //if (_modalOverlayCount === 0)   //Could write some focus blocking code on the doc here if nec.
        //{
        //use focusin event to block and refocus on top dialog?
        //}

        //Create the overlay and place it just after the window in the DOM
        _modalOverlayCount++;
        self.modalOverlayEl = document.createElement('div');
        self.modalOverlayEl.className = 'cs-fixed-overlay';
        self.parentEl.appendChild(self.modalOverlayEl);


        //Setup mousedown event on overloay
        self.modalMousedownHandler = e => { self.onModalMouseDown(e); };
        self.modalOverlayEl.addEventListener('mousedown', self.modalMousedownHandler);
    }
    
    onModalMouseDown(e)  //If clicking on overlay try and refocus on window
    {
        e.preventDefault();
        e.stopPropagation();
        var activeElement = document.activeElement,
                isActive  = self.element === activeElement || self.element.contains(activeElement);  //Is window or something inside the window the active element?

        if (!isActive) { self.focusTabbable(); }   //If focus is outside the window focus back inside the window
    }


    //Destroys the overlay blocking the content behind the window
    destroyModalOverlay()
    {
        var self = this, overlayEl = self.modalOverlayEl;

        if (overlayEl)
        {
            _modalOverlayCount--;
            overlayEl.removeEventListener('mousedown', self.modalMousedownHandler);
            //if (_modalOverlayCount === 0)   //Remove any doc focusin events that were setup
            //{

            //}

            overlayEl.parentNode.removeChild(overlayEl);
            self.modalOverlayEl = null;
        }
    }
}


function setNumberPropsFromAttrArray(destObject, propNameArr, element)
{
    var i = 0, ii = propNameArr.length, val, attrName, propName;
    for(; i < ii; i++)
    {
        propName = propNameArr[i];
        attrName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        val      = element.getAttribute(attrName);
        if(val)
        {
            destObject[propName] = val;    
        }    
    }
}