import {customElement, bindable, ObserverLocator} from 'aurelia-framework';
import {DDL} from '../ddl/ddl';
import {closest, encodeHtml, isAlphaNumericKey} from '../chs';

@customElement('cs-mselect')
export class CsMselect
{
    @bindable src            = null;   //Item source for results
    @bindable values         = [];     //Array of selected objects
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderItemFn   = null;   //Custom function for rendering item content.   Ex: renderItem(obj, id, txt)
    @bindable renderResultFn = null;   //Custom function for rendering result content. Ex: renderResult(ddl, ctrl, obj, highlightedMarkup)

    static inject = [Element,DDL,ObserverLocator];
    constructor(el, ddl, observerLocator)
    {
        var self = this;
        self.observerLocator = observerLocator;

        //Set control properties
        self.element       = el;
        self.ddl           = ddl;      //Global singleton drop down list
        self.isOpen        = false;    //Is drop down open?
        self.lastInput     = '';       //Stores last input entered into the control (ddl uses & sets this)
    }


    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view. The binding context is the instance that the view is databound to. (All properties have their initial bound values set)
    {
        var self = this, el = self.element;

        self.contentEl = el.querySelector('.cs-mselect-items');           //Div that holds the control's current value content

        //Give it the vertical (listbox) styling if requested
        if(el.hasAttribute('vertical'))
        {
            el.classList.add('cs-mselect-vertical');                      
        }

        self.savedTabIndex = (el.tabIndex < 0) ? 0 : el.tabIndex;          //Record any tabIndex set on the control element.
        self.maxCount      = Number(el.getAttribute('max-count')) || 0;    //Minimum # of selected values allowed (0 = no limit)
        self.textProp      = el.getAttribute('text-prop') || 'text';       //Object property to use for text
        self.idProp        = el.getAttribute('id-prop')   || 'id';         //Object property to use for the ID

        //Ensure the control is tabbable (unless the control is disabled)
        if(!self.disabled)
        {
            el.tabIndex = self.savedTabIndex;
        }

        //Set milli-seconds to delay & min chars before querying. If none specified set reasonable defaults based on the src type
        if (Array.isArray(self.src))
        {
            self.delay    = Number(el.getAttribute('delay'))     || 0;
            self.minChars = Number(el.getAttribute('min-chars')) || 0;
        }
        else
        {
            self.delay    = Number(el.getAttribute('delay'))     || 300;
            self.minChars = Number(el.getAttribute('min-chars')) || 2;
        }


        //Bind events
        self.clickHandler     = e => self.onClick(e);
        self.mousedownHandler = e => self.onMousedown(e);
        self.focusHandler     = e => self.onFocus(e);
        self.blurHandler      = e => self.onBlur(e);
        self.keydownHandler   = e => self.onKeyDown(e);

        el.addEventListener('click',     self.clickHandler);
        el.addEventListener('mousedown', self.mousedownHandler);
        el.addEventListener('focus',     self.focusHandler);
        el.addEventListener('blur',      self.blurHandler);
        el.addEventListener('keydown',   self.keydownHandler);
        
        //Subscribe to changes to the values array
        self.onValuesElementsChanges = () => self.valuesElementsChanged();
        self.observerLocator.getArrayObserver(self.values).subscribe(self.onValuesElementsChanges);
        
        self.renderContent();
    }
    unbind()   //Called when the databinding engine unbinds the view
    {
        var self = this, el = self.element;
        el.removeEventListener('click',     self.clickHandler);
        el.removeEventListener('mousedown', self.mousedownHandler);
        el.removeEventListener('focus',     self.focusHandler);
        el.removeEventListener('blur',      self.blurHandler);
        el.removeEventListener('keydown',   self.keydownHandler);

        //Dispose of ArrayObserver subscription
        self.observerLocator.getArrayObserver(self.values).unsubscribe(self.onValuesElementsChanges);
    }



    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onClick(e)
    {
        if(this.disabled) { return; }

        var xClicked = closest(e.target, '.cs-mselect-item-x');
        if (xClicked)                                                   //If an item's x button was clicked
        {
            var item = closest(e.target, '.cs-mselect-item');           //Get the item
            var id   = Number(item.dataset.id);                         //Read data-id attribue

            this.values.chsRemoveWithProperty(this.idProp, id);         //Remove the obj from the values [] matching this id
        }
    }

    onMousedown(e)
    {
        if(closest(e.target, '.cs-mselect-item-x')) {return;}           //If an item's x button was clicked

        setTimeout(()=>
        {
            this.ddl.open(this);                                        //Allow any DDL open on another control to close before reopening on this one
        }, 1);
    }

    onFocus()
    {
        if(this.disabled) { this.onBlur(); return; }
        this.element.classList.add('focused');
    }

    onBlur()
    {
        this.element.classList.remove('focused');
    }

    onKeyDown(e)
    {
        if (this.disabled) { return; }

        if (e.keyCode === 38 || e.keyCode === 40 || isAlphaNumericKey(e.keyCode))  //Up, Down, or alphanumeric key
        {
            this.ddl.open(this);
        }
    }





    //Propety change handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    disabledChanged(newVal)
    {
        var el = this.element;
        if(newVal)
        {
            el.classList.add('disabled');
            el.tabIndex = -1;                  //Prevent tabbing
        }
        else
        {
            el.classList.remove('disabled');
            el.tabIndex = this.savedTabIndex;  //Enable tabbing
        }
    }

    valuesChanged(newVal, oldVal)                 //The values [] itself has been changed
    {
        var self = this;
        
        //Dispose of any previous ArrayObserver subscription & subscribe to changes of new array
        self.observerLocator.getArrayObserver(oldVal).unsubscribe(self.onValuesElementsChanges);
        self.observerLocator.getArrayObserver(newVal).subscribe(self.onValuesElementsChanges);
        
        self.renderContent();
    }

    valuesElementsChanged()                    //The contents of the values [] changed
    {
        this.renderContent();
    }


    //Actions
    //-------------------------------------------------------------------------------------------------------------------------------------------
    clear()
    {
        this.values.length = 0;   //Clear array
        this.renderContent();
    }

    setOpenState(b)  //Called by ddl
    {
        this.isOpen = b;

        if(b) { this.element.classList.add('open');    }
        else  { this.element.classList.remove('open'); }
    }


    addSelectedItem (o)  //Called (usually by ddl) when result item selected
    {
        if(this.maxCount === 0 || this.values.length < this.maxCount)
        {
            this.values.push(o);
        }
    }

    renderContent()
    {
        var self = this, markup = '';

        for(var i = 0, ii = self.values.length; i < ii; i++)
        {
            markup += getItemMarkup(self, self.values[i]);
        }
        self.contentEl.innerHTML = markup;
    }
}


function getItemMarkup(ctrl, obj)
{
    var id   = obj[ctrl.idProp];
    var text = obj[ctrl.textProp];
    var itemContent = ctrl.renderItemFn ? ctrl.renderItemFn(obj, id, text) : encodeHtml(text);

    return "<li class='cs-mselect-item' data-id='" + id + "'><div class='cs-mselect-item-content'>" + itemContent + "</div><div class='cs-mselect-item-x'>x</div></li>";
}