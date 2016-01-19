import {docOffset} from '../chs';

var MonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var PrevButtonCSS  = 'cs-cal-prev',
    NextButtonCSS  = 'cs-cal-next',
    CellContentCSS = 'cs-cal-cell-content';

//Singleton calendar (datepicker) popup for cs-date
//----------------------------------------------------------------------------------------
export class CalendarPopup
{
    constructor()
    {
        var self     = this;
        self.curCtrl = null;      //Reference to the current cs-date ctrl this calendar is working with

        //Create a <div class='cs-cal'> element which can be appended to the document body.
        //We delay adding it until needing to show for the 1st time.
        self.element = document.createElement('div');
        self.element.className = 'cs-cal cs-hidden';
    }

    getYearSelectMarkup(currentYear)
    {
        var m = "<select id='cs-cal-select-year' class='cs-cal-select'>";
        var lastYr = currentYear+5;
        for (var i = currentYear-10; i < lastYr; i++)
        {
            if(currentYear == i) { m += "<option selected value='" + i + "'>" + i + "</option>"; }
            else                 { m += "<option value='" + i + "'>" + i + "</option>"; }
        }
        return (m + "</select>");
    }

    getMonthSelectMarkup(currentMonth)
    {
        var m = "<select id='cs-cal-select-month' class='cs-cal-select'>";
        for (var i = 0; i < 12; i++)
        {
            if(i == currentMonth) { m += "<option selected value='" + i + "'>" + MonthName[i] + "</option>"; }
            else                  { m += "<option value='" + i + "'>" + MonthName[i] + "</option>"; }
        }
        return (m + "</select>");
    }


    wireEvents()
    {
        var self = this;

        if(self.mousedownHandler) { return; }   //Don't allow multiple sets of event handlers

        //Mouse Down
        self.mousedownHandler = function(ev)
        {
            var target = ev.target;

            //If mousedown on calendar
            if(self.element.contains(target)) { return; }

            //If mousedown on current cs-date ctrl
            if(self.curCtrl && self.curCtrl.element.contains(target)) { return; }

            self.hide();
        };

        //Mouse Up
        self.mouseupHandler = function(ev)
        {
            var cl = ev.target.classList;

            if(cl.contains(PrevButtonCSS)) { return self.incMonth(-1); }   //Prev button on calendar
            if(cl.contains(NextButtonCSS)) { return self.incMonth(1);  }   //Next button on calendar

            if(cl.contains(CellContentCSS))                                //Calendar day cell
            {
                self.curCtrl.value = new Date(self.lastDt.getFullYear(), self.lastDt.getMonth(), ev.target.textContent);
                self.hide();
                self.curCtrl.focus();
            }
        };


        //Change
        self.changeHandler = function(ev)
        {
          var id = ev.target.id, value = ev.target.value;

               if(id == 'cs-cal-select-month') { self.setMonth(value); }
          else if(id == 'cs-cal-select-year')  { self.setYear(value);  }
        };

        document.addEventListener('mousedown', self.mousedownHandler);
        self.element.addEventListener('mouseup', self.mouseupHandler);
        self.element.addEventListener('change', self.changeHandler);
    }

    removeEvents()
    {
        var self = this;
        document.removeEventListener('mousedown', self.mousedownHandler);
        self.element.removeEventListener('mouseup', self.mouseupHandler);
        self.element.removeEventListener('change', self.changeHandler);
        self.mousedownHandler = null;
        self.mouseupHandler   = null;
        self.changeHandler    = null;
    }

    hide()
    {
        var self    = this;
        self.isOpen = false;
        self.lastDt = null;  //Clear out last so on next show we'll render from the ctrl's date
        self.element.classList.add("cs-hidden");
        self.removeEvents();
    }

    show(ctrl)
    {
        var self    = this;
        self.isOpen = true;
        if(!self.isCalAppeneded)
        {
            document.body.appendChild(self.element);
            self.isCalAppeneded = true;
        }
        if(ctrl) { self.curCtrl = ctrl; }
        self.render();
        self.position();
        self.element.classList.remove("cs-hidden");
        self.wireEvents();
    }


    //Increments/decrements the rendered month
    incMonth(delta)
    {
        this.setMonth(this.lastDt.getMonth() + delta);
    }

    //Sets the rendered month
    setMonth(month)
    {
        var lDt = this.lastDt;
        lDt.setMonth(month, 1);  //month, day
        this.render(lDt);
    }

    //Sets the rendered year
    setYear(year)
    {
        var lDt = this.lastDt;
        lDt.setDate(1);          //I think 1st setting day=1 may prevent wierd edgecase errors
        lDt.setFullYear(year);
        this.render(lDt);
    }


    render(pDt)
    {
        var self = this, ctrl = self.curCtrl, ctrlDt = ctrl.value;

        var dt = pDt || ctrlDt || new Date();            //Prefer passed dt, fall back to ctrl's dt, else use current date.
        dt = new Date(dt.getTime());                     //Clone in case we're using the ctrl's date (which we wanna preserve)

        var month       = dt.getMonth();
        var year        = dt.getFullYear();
        var firstDayDt  = new Date(year, month, 1);      //1st date of the month
        var startDay    = firstDayDt.getDay();           //That date's day number (0-6)
        var todayDt     = new Date();                    //Today's date
        var today       = -1;                            //Today's day number. -1 if today's date doesn't fall within the calendar month we are rendering.
        var activeDay   = -1;                            //Day number of the currently selected date in dtCtrl. -1 if one doesn't exist within the calendar month we are rendering.

        //Record that this was the last date we rendered
        self.lastDt = dt;

        //Get total days in the month
        dt = new Date(year, month + 1, 0);
        var daysInMonth = dt.getDate();

        //Explanation of the above:
        //Date constructor attempts to convert year/month/day values to the nearest valid date. Month is incremented to get the following month, then a Date object is created with zero days.
        //Since this is invalid, the Date object defaults to the last valid day of the previous month which is the month we're actually interested in.
        //Then getDate() returns the day (1-31) of that date, & that gives us the number of days in that month. As a bonus this handles leap year too.


        //Determine if the month we're rendering includes today's date
        if(month == todayDt.getMonth() && year == todayDt.getFullYear())
        {
            today = todayDt.getDate();
        }

        //Determine if the month we're rendering includes the currently selected date
        if(ctrlDt && month == ctrlDt.getMonth() && year == ctrlDt.getFullYear())
        {
            activeDay = ctrlDt.getDate();
        }

        //Generate markup for the title area containing the Month Year selects
        var titleContent = "<div class='cs-cal-title-lbl'>" + MonthName[month] + self.getMonthSelectMarkup(month) + "</div><div class='cs-cal-title-lbl'>" + year + self.getYearSelectMarkup(year) + "</div>";


        var html = `<div class='cs-cal-hdr'>
                        <a class='` + PrevButtonCSS + `'><i class='cs-cal-prev-ico'></i></a>
                        <div class='cs-cal-title'>` + titleContent + `</div>
                        <a class='` + NextButtonCSS + `'><i class='cs-cal-next-ico'></i></a>
                    </div>
                    <table class='cs-cal-tbl'>
                        <tr class='cs-cal-dayrow'>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Su</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Mo</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Tu</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>We</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Th</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Fr</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Sa</span></th>
                        </tr><tr>`;

        //Build day cells
        var w = 0, d, dayCount = 1;
        for (; w < 6; w++)           //Week loop (6 rows may be more than we need. We'll break out before if so.)
        {
            for (d = 0; d < 7; d++)  //Day loop (cells)
            {
                if (dayCount <= daysInMonth && (w > 0 || d >= startDay))       //Fill the cell if we still have days left, & we're not on the 1st row, or this day is >= the starting day for the month
                {
                    html += "<td class='cs-cal-cell";

                    if(dayCount == activeDay) { html += " cs-active"; }        //Currently selected day

                    html += "'><div class='cs-cal-cell-content";

                    if(dayCount == today)  { html += " cs-today"; }            //Today's date cell

                    html += "'>" + dayCount + "</div></td>";
                    dayCount++;
                }
                else
                {
                    html += '<td class="cs-cal-cell cs-cal-cell-blank"></td>'; //Empty cell
                }
            }
            if(dayCount > daysInMonth) { break; }
            html += "</tr><tr>";
        }
        html += "</tr></table>";

        self.element.innerHTML = html;
    }

    position()
    {
        var ctrlEl      = this.curCtrl.element,         //The DOM element for the control we are attaching to
            ctrlPos     = docOffset(ctrlEl),            //Coordinates relative to the document
            cal         = this.element,                 //The calendar element
            ctrlHeight  = ctrlEl.offsetHeight,          //Height of the control we're attached to
            y           = ctrlPos.top + ctrlHeight,     //Y position directly below ctrl
            wh          = window.innerHeight,           //Height of the browser viewport including, if rendered, the horizontal scrollbar
            topSpace    = ctrlPos.top,                  //Space available above ctrl
            botSpace    = (wh - y);                     //Space available below ctrl


        //Set cal left position
        cal.style.left = ctrlPos.left + 'px';

        //If cal would extend beyond the window assume it's better to show above the control *IF* topSpace has more room
        if ((y + cal.offsetHeight) > wh)
        {
            if (topSpace > botSpace) //Top space has more room so put above the ctrl
            {
                y = ctrlPos.top - cal.offsetHeight - 1;
            }
        }

        //Set top position
        cal.style.top = y + 'px';
    }
}
