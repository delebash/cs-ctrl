var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

import {customElement, bindable, bindingMode, computedFrom} from 'aurelia-framework';
import {CalendarPopup} from './calendar-popup';


@customElement('cs-date')
@bindable({name              : 'value',
           attribute         : 'value',
           changeHandler     : 'valueChanged',
           defaultBindingMode: bindingMode.twoWay,
           defaultValue      : null
})
export class CsDate
{
    @bindable disabled       = false;  //Is the control disabled?

    static defaultOps =
    {
        format : "ISO"             //The format date strings are expected to be in. ISO=YYYY-MM-DD, USA=M/D/YYYY
    };

    static inject = [Element, CalendarPopup];
    constructor(element, calendar)
    {
        this.element  = element;
        this.calendar = calendar;
    }

    @computedFrom('value')
    get dateNum()  //Property used to display the month's date inside the "show calendar" button in the view
    {
        return this.value ? this.value.getDate() : '';
    }

    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view
    {
        var self = this, el = self.element;
        self.ops = Object.assign({}, CsDate.defaultOps);

        self.savedTabIndex = (el.tabIndex < 0) ? 0 : el.tabIndex;          //Record any tabIndex set on the control element.
        el.tabIndex = -1;                                                  //Prevent tabbing to the control (use internal input instead)

        //Set options from attributes
        self.ops.format   = el.getAttribute("format") || self.ops.format;
        self.ops.required = el.hasAttribute("required");


        //Disable ctrl if disabled attribute is present w/ no value
        if(el.hasAttribute("disabled") && el.getAttribute("disabled") === "")
        {
            self.disabled = true;
        }

        self.updateInputValue();
    }
    attached()
    {
        this.inputEl.tabIndex = this.savedTabIndex;                        //Ensure input is tabbable...
        if(this.disabled) { this.inputEl.tabIndex = -1; }                  //...(unless the control is disabled)
    }

    //Binding change handlers
    //----------------------------------------------------------------------------
    valueChanged(newVal)
    {
        this.updateInputValue();
    }

    disabledChanged(newVal)
    {
        var el = this.element;
        if(newVal)
        {
            el.classList.add("cs-disabled");
            el.tabIndex = -1;                  //Prevent tabbing
        }
        else
        {
            el.classList.remove("cs-disabled");
            el.tabIndex = this.savedTabIndex;  //Enable tabbing
        }
    }


    //Actions
    //----------------------------------------------------------------------------
    updateInputValue()  //Updates this.inputValue which is bound to the control's textbox
    {
        var self = this, dt = self.value;
        if(!dt) { self.inputValue = ""; return; }

        if(self.ops.format == "ISO")
        {
            self.inputValue = dt.getFullYear() + "-" + pad2(dt.getMonth() + 1) + "-" + pad2(dt.getDate());
        }
        else   //USA
        {
            self.inputValue = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
        }
    }

    focus()
    {
        this.inputEl.focus();
    }



    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onFocus()
    {
        if(this.disabled) { this.onBlur(); return; }
        this.element.classList.add("cs-focused");
    }

    onBlur()
    {
        this.element.classList.remove("cs-focused");
    }

    onInput()
    {
        var self = this, txt = self.inputValue;

        if(!txt)   //If input is blank, set date value to null
        {
            self.value = null;
            return;
        }

        //If date ented is valid, assign the new date value. If invalid, ignore the bogus input.
        var dt = parseDateStr(txt, self.ops.format);
        if(dt) { self.value = dt; }
    }

    showCalendar()
    {
        var self = this, cal = self.calendar;
        if(self.disabled) { return; }
        if(cal.curCtrl == self && cal.isOpen) { cal.hide(); return; }  //If calendar was already showing for this ctrl, toggle it off

        cal.show(self);
    }
}



//Pads the given value with a 0 as necessary to ensure it is 2 digits
function pad2(num)
{
    var s = "0" + num;
    return s.substr(s.length - 2);
}

//Returns a date object if the given date string matches the given format & is a valid date. Returns null otherwise.
function parseDateStr(txt, fmt)
{
    var year, month, day, parts, maxDays;

    if(!txt) { return null; }

    if(fmt == "ISO")          //ISO = YYYY-MM-DD
    {
        if(txt.length != 10) { return null; }
        year  = Number(txt.substr(0, 4));
        month = Number(txt.substr(5, 2));
        day   = Number(txt.substr(8, 2));
    }
    else                      //USA = M/D/YYYY
    {
        parts = txt.split(/[\/\.-]/);   //Allow / . - as seperators
        if(parts.length != 3) { return null; }
        month = Number(parts[0]);
        day   = Number(parts[1]);
        year  = Number(parts[2]);
    }


    //Run some checks
    if(!(month > 0 && day > 0 && year > 0)) { return null; }  //Ensure all date parts are positive numbers
    if(month > 12)                          { return null; }  //Ensure a valid month #


    //Get max days in the month
    maxDays = MonthDays[month-1];
    if(month == 2)                     //Check for leap year in case of Feb
    {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))  //If leap year
        {
            maxDays = 29;
        }
    }
    if(day > maxDays) { return null; }  //Ensure valid day

    return new Date(year, month-1, day);
}
