var defOptions = 
{
    element       : null,   //Element to be resized
    handle        : null,   //Handle element used for resize dragging
    resizeWidth   : true,
    resizeHeight  : true,

    onStart   : null,
    onEnd     : null,
    onResize  : null,

    touchActionNone: true   //Prevents browser level actions like forward/back gestures on the handle
};

export class Resizable
{
    constructor(ops)
    {
        
        var self = this, handle = ops.handle;
        self.ops = Object.assign({}, defOptions, ops);
        
        //Set touch-action on the handle to none unless specifically told not to (Prevents browser level actions like forward/back gestures on the handle)
        if (ops.touchActionNone) { handle.style.touchAction = 'none'; }
        
        //Add a resizable class to the element
        //ops.element.classList.add('cs-resizable');
        
        
        //Add event handlers
        self.resizeStartHandler = function(e) { self.onResizeStart(e); };
        self.dragHandler        = function(e) { self.onDrag(e);        };
        self.resizeEndHandler   = function(e) { self.onResizeEnd(e);   };
        
        
        //Wire mousedown/touchstart events
        handle.addEventListener('mousedown',  self.resizeStartHandler);
        if(hasTouch())
        {
            handle.addEventListener('touchstart', self.resizeStartHandler);
        }
    }
    
    
    onResizeStart(e)
    {
        var self = this, pos, o = self.ops, el = o.element, doc = document;
        
        //Get position and width
        pos                = getPositon(e);
        pos.width          = el.offsetWidth;
        pos.height         = el.offsetHeight;
        self.startPosition = pos;
        
        //Disable any transitions that may be on the element during the resize
        self.origTransition = el.style.transition;
        el.style.transition = 'none';
        
        //Call any user supplied onStart function and stop processing if it returns false
        if(o.onStart && (o.onStart(e, el, o)===false)) { return false; }
        
        enableSelection(false);
        
        //Wire dragging events
        doc.addEventListener('mousemove', self.dragHandler);
        doc.addEventListener('mouseup', self.resizeEndHandler);
        if(hasTouch())
        {
            doc.addEventListener('touchmove', self.dragHandler);
            doc.addEventListener('touchend', self.resizeEndHandler);
        }
        
        el.classList.add('cs-resizing');
    }
    
    onDrag(e)
    {
        var self = this, o = self.ops, pos = getPositon(e), startPos = self.startPosition, el = o.element;
        
        if(o.resizeWidth)
        {
            el.style.width = (startPos.width + pos.x - startPos.x) + 'px';
        }
        if(o.resizeHeight)
        {
            el.style.height = (startPos.height + pos.y - startPos.y) + 'px';
        }
        
        if(o.onResize) { o.onResize(e, el, o); }
    }
    
    onResizeEnd(e)
    {
        var self = this, o = self.ops, el = o.element, doc = document;
        
        doc.removeEventListener('mousemove', self.dragHandler);
        doc.removeEventListener('mouseup', self.resizeEndHandler);
        if(hasTouch())
        {
            doc.removeEventListener('touchmove', self.dragHandler);
            doc.removeEventListener('touchend', self.resizeEndHandler);
        }
        
        enableSelection(true);
        
        el.style.transition = self.origTransition; 
        
        if(o.onEnd) { o.onEnd(e, el, o); }
        
        el.classList.remove('cs-resizing');
        
        noop(e);
    }
    
    dispose()
    {
        var self = this;
        self.ops.handle.removeEventListener('mousedown',  self.resizeStartHandler);
        if(hasTouch())
        {
            self.ops.handle.removeEventListener('touchstart', self.resizeStartHandler);
        }
    }
}

function noop(e) 
{
    e.stopPropagation();
    e.preventDefault();
};

function getPositon(e)
{
         if(typeof e.clientX === "number") { return {x: e.clientX, y: e.clientY}; }
    else if(e.originalEvent.touches)       { return {x: e.originalEvent.touches[0].clientX, y: e.originalEvent.touches[0].clientY}; }
    
    return {x:0, y: 0};
}

function hasTouch()
{
    return window.Touch || navigator.maxTouchPoints;
}

function enableSelection(b)
{
    var classList = document.body.classList;
    var css       = 'cs-noselect';
    
    if(b) { classList.remove(css); }
    else  { classList.add(css);    }
}