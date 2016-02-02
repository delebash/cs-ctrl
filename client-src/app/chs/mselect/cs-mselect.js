import {customElement, bindable} from 'aurelia-framework';
import {DDL} from '../ddl/ddl';
import {closest, encodeHtml, isAlphaNumericKey} from '../chs';

@customElement('cs-mselect')
export class CsMselect
{
    @bindable src            = null;   //Item source for results
    @bindable values         = [];     //Array of selected objects
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderResultFn = null;   //Custom function for rendering result content. Ex: renderResult(ddl, ctrl, obj, highlightedMarkup)

    static inject = [Element,DDL];
    constructor(el, ddl)
    {
        var self = this;

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

    onKeydown(e)
    {
        if (this.disabled) { return true; }

        if (e.keyCode === 38 || e.keyCode === 40 || isAlphaNumericKey(e.keyCode))  //Up, Down, or alphanumeric key
        {
            this.ddl.open(this);
        }
        return true;  //Necessary or tabbing won't work. (Something Aurelia is doing I think)
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


    //Actions
    //-------------------------------------------------------------------------------------------------------------------------------------------
    clear()
    {
        this.values.length = 0;   //Clear array
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
}