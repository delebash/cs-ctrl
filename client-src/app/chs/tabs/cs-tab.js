import {customElement, bindable} from 'aurelia-framework';

@customElement('cs-tab')
export class CsTab
{
    @bindable title = null;   //Header text shown for this tab

    static inject = [Element];
    constructor(element)
    {
        this.element = element;
    }


    //Actions
    //--------------------------------------------------------
    show(b)
    {
        var css = "cs-active";
        if(b) { this.element.classList.add(css);    }
        else  { this.element.classList.remove(css); }
    }
}
