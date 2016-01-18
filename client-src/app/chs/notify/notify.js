var _queue        = [];       //A queue of notification alerts to display
var _visibleCount = 0;        //# of alerts that are currently showing
var _isAttached   = false;    //Has container been add to DOM? (Done on 1st open for reliability)
var _doc          = document; //The document

//Create container <div> that will hold the notification alerts
var _container = _doc.createElement("div");
_container.id  = "cs-notify-bottom-right";


class Notify
{
    constructor()
    {
        this.options =
        {
            expires: 8000,                //How long to show message
            canClose: true,               //Can alerts be closed by clicking them?
            stayOnHover: true,            //Should hovering over the alert cause it to stick around even if expiration time elapses?
            timeAfterHover:2000,          //How long the alert should stick around after the user stops hovering over it
            max: 3,                       //Max alerts that can show before they get queued
            delay: 0,                     //How long to wait before showing alert
            icoCss: 'ico32-check',        //CSS class for icon
            alertCss: 'cs-note-success',  //CSS class to put on the notification alert
            title: 'Success'              //Title on the notification alert
        };
    }

    create(ops)
    {
        //Create a new Alert object
        var alert = new Alert();
        ops       = Object.assign({}, this.options, ops);

        //Have alert init itself after delay
        setTimeout(() =>
        {
            alert.init(ops);
        }, ops.delay);
    }

    error(msg, ops = {})
    {
        ops.msg = msg;
        this.create(Object.assign({ alertCss: "cs-note-error", icoCss: "ico32-alert", title: "Error" }, ops));
    }
    info(msg, ops = {})
    {
        ops.msg = msg;
        this.create(Object.assign({ alertCss: "cs-note-info", icoCss: "ico32-info", title: "Info" }, ops));
    }
    success(msg, ops = {})
    {
        ops.msg = msg;
        this.create(ops);
    }
}
export var notify = new Notify();


class Alert
{
    init(ops)
    {
        var self = this;
        
        //Create alert elements
        var alert = _doc.createElement("div");    //The alert div
        var ico   = _doc.createElement("div");    //The alert's icon
        var title = _doc.createElement("div");    //The alert's title
        var msg   = _doc.createElement("div");    //The alert's message

        //Add classes to them
        alert.className  = "cs-note " + ops.alertCss;
        ico.className    = "cs-note-ico " + ops.icoCss;
        title.className  = "cs-note-title";
        msg.className    = "cs-note-msg";

        //Add title and message content
        title.innerHTML = ops.title;
        msg.innerHTML   = ops.msg;

        //Assemble the icon, title, and message inside the alert
        alert.appendChild(ico);
        alert.appendChild(title);
        alert.appendChild(msg);

        //Store the alert element and its options
        self.element = alert;
        self.options = ops;

        //Queue the opening of the alert
        _queue.push(self);

        //Dequeue if there's room for more alerts
        dequeue();

        //If the alert can close by being clicked wire up a click handler to close the alert
        if (ops.canClose)
        {
            self.clickHandler = () => self.close();
            alert.addEventListener('click', self.clickHandler);
        }

        //If the alert should stay when hovered over, wireup the events to handle it
        if (ops.stayOnHover)
        {
            self.mouseEnterHandler = () =>
            {
                if(self.expireID)     { clearTimeout(self.expireID); self.expireID = 0; }
            };
            alert.addEventListener('mouseenter', self.mouseEnterHandler);


            self.mouseLeaveHandler = () =>
            {
                self.expireID = setTimeout(()=>self.close(), ops.timeAfterHover);
            };
            alert.addEventListener('mouseleave', self.mouseLeaveHandler);
        }
    }//End init()

    close()
    {
        var self = this, el = self.element, style = el.style;
        
        //Set alert styles to transition to
        style.opacity   = 0;
        style.transform = "scale(.01)";

        //Remove the alert after the animation has had time to run
        setTimeout(() =>
        {
            _container.removeChild(el);
            _visibleCount--;
            dequeue();
        }, 1000);
        
        //Cleanup
        if(self.clickHandler)      { el.removeEventListener('click',      self.clickHandler);}
        if(self.mouseEnterHandler) { el.removeEventListener('mouseenter', self.mouseEnterHandler);}
        if(self.mouseLeaveHandler) { el.removeEventListener('mouseleave', self.mouseLeaveHandler);}
        if(self.expireID)          { clearTimeout(self.expireID); }
    }

    open()
    {
        var el    = this.element,
            style = el.style;

        //Setup alert's initial state for the start of the animation
        style.opacity   = 0;
        style.transform = 'scale(.01)';

        //Add alert container to the DOM if not done yet
        if(!_isAttached)
        {
            _doc.body.appendChild(_container);
        }
        
        //Add the alert to the notification container
        _visibleCount++;
        _container.appendChild(el);

        //Animate the alert into view
        setTimeout(()=>
        {
            el.classList.add('cs-note-animate');

            style.opacity   = 1;
            style.transform = 'none';
        }, 100);
    }
}

function dequeue()
{
    //Dequeue if there's room for more alerts
    if( (_visibleCount < notify.options.max) && _queue.length)
    {
        var alert = _queue.shift();
        var ops   = alert.options;

        alert.open();

        //Setup auto expire
        if (ops.expires > 0)
        {
            alert.expireID = setTimeout(()=>alert.close(), ops.expires);
        }
    }
}