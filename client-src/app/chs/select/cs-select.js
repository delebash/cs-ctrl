import {customElement, bindable, bindingMode} from 'aurelia-framework';
import {encodeHtml, closest, isAlphaNumericKey}       from '../chs';
import {DDL} from '../ddl/ddl';

@customElement('cs-select')

export class CsSelect
{
    @bindable({defaultBindingMode: bindingMode.twoWay}) value = null;   //Selected value object or id (depending on if scalar set) 
    @bindable src            = null;   //Item source for results
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderResultFn = null;   //Custom function for rendering result content. Ex: renderResult(ddl, ctrl, obj, highlightedMarkup)
  
    static inject = [Element, DDL];
    constructor(el, ddl)
    {
        var self = this;
        
        //Set control properties
        self.element      = el;
        self.ddl          = ddl;       //Global singleton drop down list
        self.isOpen       = false;     //Is drop down open?
        self.lastInput    = '';        //Stores last input entered into the control (ddl uses & sets this)
    }


    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view. The binding context is the instance that the view is databound to. (All properties have their initial bound values set)
    {
        var self = this, el = self.element;

        self.contentEl = el.querySelector('.cs-select-content');          //Div that holds the control's current value content

        self.savedTabIndex = (el.tabIndex < 0) ? 0 : el.tabIndex;          //Record any tabIndex set on the control element.
        self.required      = el.hasAttribute('required');                  //Record if this is a required field or is nullable
        self.textProp      = el.getAttribute('text-prop') || 'text';       //Object property to use for text
        self.idProp        = el.getAttribute('id-prop')   || 'id';         //Object property to use for the ID
        self.isObj         = !el.hasAttribute('scalar');                   //Is the value of the control an object or a scalar id?

        //Make control tabbable (unless the control is disabled)
        if(!self.disabled)
        {
            el.tabIndex  = self.savedTabIndex;
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

       

        self.valueChanged(self.value);
    }
   


    //Binding change handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    valueChanged(newVal)
    {
        if(this.dontUpdateItem) { this.dontUpdateItem = false; return; }  //Skip update of item this time
        this.updateItem();
    }
    
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
        this.value = null;
    }

    setOpenState(b)  //Called by ddl
    {
        this.isOpen = b;

        if(b) { this.element.classList.add('open'); }
        else  { this.element.classList.remove('open'); }
    }

    addSelectedItem(o)  //Called (usually by ddl) when a new item is selected
    {
        this.item = o;
        this.dontUpdateItem = true;                //Because we already have it correct, don't update it in valueChanged
        this.value = this.isObj ? o : o[this.idProp];
    }
    


    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onClick(e)
    {
        if(this.disabled) { return; }

        if (closest(e.target, '.cs-select-clear'))   //If clear button was clicked
        {
            this.clear();
        }
    }

    onMousedown(e)
    {
        if(this.disabled) { return; }

        if (closest(e.target, ".cs-select-clear"))   //If clear button was clicked
        {
            return;
        }
        setTimeout(() =>                                 //Allow any DDL open on another control to close before reopening on this one
        {
            this.ddl.open(this);
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


    updateItem()
    {
        var self = this, v = self.value, id, src = self.src, i = 0;
        
        self.item = null;
        
        if(self.isObj)
        {
            self.item = v;
        }
        else if(v || v === 0)
        {
            id = v;
            
            if(Array.isArray(src))                  //If src is an [] try and look up the item from there
            {
                for(; i < src.length; i++)
                {
                    if(src[i][self.idProp] == id) { self.item = src[i]; break; }
                }
            }
        }
    }
}