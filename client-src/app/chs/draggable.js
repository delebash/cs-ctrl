var defOptions = 
{
    element       : null,   //Element to be dragged
    handle        : null,   //Handle element where dragging must be done from
    ignore        : null,   //Ignore drag starts if the given CSS selector or element matches the target or its parents

    //Callbacks consumers can register for
    onStart   : null,       //(event, element, ops)
    onDrag    : null,       //(position, element, ops)
    onEnd     : null,       //(event, element, ops)
    
    touchActionNone: true   //Prevents browser level actions like forward/back gestures on the handle
};

export class Draggable
{
    constructor(ops)
    {
        var self = this, handle = ops.handle;
        self.ops = Object.assign({}, defOptions, ops);
        
        self.isMouseDown = false;
        
        //Set touch-action on the handle to none unless specifically told not to (Prevents browser level actions like forward/back gestures on the handle)
        if (ops.touchActionNone) { handle.style.touchAction = 'none'; }
        
        //Add a draggable class to the element
        //ops.element.classList.add('cs-draggable');
        
        //Add event handlers
        self.dragStartHandler = function(e) { self.onDragStart(e); };
        self.dragHandler      = function(e) { self.onDrag(e);      };
        self.dragEndHandler   = function(e) { self.onDragEnd(e);   };
        
        //Wire mousedown/touchstart events
        handle.addEventListener('mousedown',  self.dragStartHandler);
        if(hasTouch())
        {
            handle.addEventListener('touchstart', self.dragStartHandler);
        }
        
        //Function to call to update the animation
        self.animateHandler = () => { animate(self); };
    }
    
    
    onDragStart(e)
    {
        var self = this, pos, o = self.ops, el = o.element, doc = document;
        
        //Note that mouse is now down
        self.isMouseDown  = true;
        
        //Get position
        pos                = getPositon(e);
        pos.left           = el.offsetLeft;
        pos.top            = el.offsetTop;
        self.startPosition = pos;
        self.lastPosition  = pos;
        
        //Disable any transitions that may be on the element during the drag
        self.origTransition = el.style.transition;
        el.style.transition = 'none';
        
        //Call any user supplied onStart function and stop processing if it returns false
        if(o.onStart && (o.onStart(e, el, o)===false)) { return false; }
        
        enableSelection(false);
        
        //Wire dragging events
        doc.addEventListener('mousemove', self.dragHandler);
        doc.addEventListener('mouseup', self.dragEndHandler);
        if(hasTouch())
        {
            doc.addEventListener('touchmove', self.dragHandler);
            doc.addEventListener('touchend', self.dragEndHandler);
        }
        
        el.classList.add('cs-dragging');
        requestAnimationFrame(self.animateHandler);
    }
    
    onDrag(e)
    {
        this.lastPosition = getPositon(e);
    }
    
    onDragEnd(e)
    {
        var self = this, o = self.ops, el = o.element, doc = document;
        
        self.isMouseDown = false;
        
        doc.removeEventListener('mousemove', self.dragHandler);
        doc.removeEventListener('mouseup', self.dragEndHandler);
        if(hasTouch())
        {
            doc.removeEventListener('touchmove', self.dragHandler);
            doc.removeEventListener('touchend', self.dragEndHandler);
        }
        
        enableSelection(true);
        
        el.style.transition = self.origTransition; 
        
        if(o.onEnd) { o.onEnd(e, el, o); }
        
        el.classList.remove('cs-dragging');
        noop(e);
    }
    
    dispose()
    {
        var self = this;
        self.ops.handle.removeEventListener('mousedown',  self.dragStartHandler);
        if(hasTouch())
        {
            self.ops.handle.removeEventListener('touchstart', self.dragStartHandler);
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

function animate(draggable)
{
    var o = draggable.ops, pos = draggable.lastPosition, startPos = draggable.startPosition, el = o.element;
    
    el.style.left = (startPos.left + pos.x - startPos.x) + 'px';
    el.style.top  = (startPos.top  + pos.y - startPos.y) + 'px';
    
    if(o.ondrag) { o.ondrag(pos, el, o); }
    
    //Setup next frame
    if(draggable.isMouseDown) { requestAnimationFrame(draggable.animateHandler); }
}