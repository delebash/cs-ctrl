import {customElement, bindable, bindingMode} from 'aurelia-framework';
import {encodeHtml, closest, isAlphaNumericKey}       from '../chs';
import {DDL} from '../ddl/ddl';

@customElement('cs-select')

export class CsSelect
{
    @bindable({defaultBindingMode: bindingMode.twoWay}) value = null;   //Selected value object
    @bindable src            = null;   //Item source for results
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderItemFn   = null;   //Custom function for rendering item content.   Ex: renderItem(obj, id, txt)
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

        self.valueChanged(self.value);
    }
    unbind()   //Called when the databinding engine unbinds the view
    {
        var el = this.element;
        el.removeEventListener('click',     self.clickHandler);
        el.removeEventListener('mousedown', self.mousedownHandler);
        el.removeEventListener('focus',     self.focusHandler);
        el.removeEventListener('blur',      self.blurHandler);
        el.removeEventListener('keydown',   self.keydownHandler);
    }


    //Binding change handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    valueChanged(newVal)
    {
        if(this.isObj)  { this.selectedItem = newVal; }
        if(!newVal)     { this.selectedItem = null;   }
        this.renderContent();
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

    onKeyDown(e)
    {
        if (this.disabled) { return; }

        if (e.keyCode === 38 || e.keyCode === 40 || isAlphaNumericKey(e.keyCode))  //Up, Down, or alphanumeric key
        {
            this.ddl.open(this);
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
        this.selectedItem = o;
        this.value = this.isObj ? o : o[this.idProp];
    }

    renderContent()
    {
        var markup, self = this, obj = self.value, id, txt, src = self.src;

        if(obj || obj === 0)
        {
            id = (self.isObj) ? obj[self.idProp] : obj;
            
            if(self.selectedItem) //If we have a selectedItem we can grab the text from
            {
                txt = self.selectedItem[self.textProp];
                self.selectedItem = null;
            }
            else                  //Else if src is an [] try and look up the item's text from there
            {
                for(var i = 0; i < src.length; i++)
                {
                    if(src[i][self.idProp] == id) { txt = src[i][self.textProp]; break; }
                }
            }
        }

        if(self.renderItemFn)   //If a custom item render() supplied call it to generate the markup to render
        {
            markup = self.renderItemFn(obj, id, txt);
        }
        else                    //Use default rendering (display selected item's "text")
        {
            markup = txt ? encodeHtml(txt) : '';
        }
        self.contentEl.innerHTML = markup;
    }
}