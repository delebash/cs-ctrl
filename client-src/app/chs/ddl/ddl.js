import {docOffset, closest, encodeHtml} from '../chs';

var ResultClass = "cs-ddl-result",
    FocusClass  = "cs-focus";


//Singleton Dropdown list class
//----------------------------------------------------------------------------------------
export class DDL
{
    constructor()
    {
        var self = this, doc = document;
        
        self.curCtrl      = null;        //Stores a reference to the current control this DDL is working with
        self.queryTimerID = 0;           //setTimeout ID for the query

        //Create & store drop down list elements
        self.ddlEl        = doc.createElement("div");    //Dropdown list
        self.inputEl      = doc.createElement("input");  //Input inside DDL
        self.inputElWrap  = doc.createElement("div");    //Wraps the input
        self.inputIco     = doc.createElement("div");    //Icon inside the input wrap
        self.resultsEl    = doc.createElement("ul");     //Results inside DDL
        self.ddlElMsg     = doc.createElement("div");    //Message below the results

        //Add classes to them
        self.ddlEl.className        = 'cs-ddl cs-hidden';
        self.inputEl.className      = 'cs-ddl-input';
        self.inputElWrap.className  = 'cs-ddl-input-wrap';
        self.inputIco.className     = 'cs-ddl-input-ico';
        self.resultsEl.className    = 'cs-ddl-results';
        self.ddlElMsg.className     = 'cs-ddl-msg';

        //Assemble them
        self.inputElWrap.appendChild(self.inputEl);
        self.inputElWrap.appendChild(self.inputIco);
        self.ddlEl.appendChild(self.inputElWrap);
        self.ddlEl.appendChild(self.resultsEl);
        self.ddlEl.appendChild(self.ddlElMsg);    
    }

    wireEvents()
    {
        var self = this, ddlEl = self.ddlEl, ctrlEl = self.curCtrl.element;

        if(self.docMousedownHandler) { return; }   //Don't allow multiple sets of event handlers

        //Input events
        self.inputKeyDownHandler = (e) => { self.onInputKeyDown(e); };
        self.inputKeyUpHandler   = (e) => { self.onInputKeyUp(e);   };

        self.inputEl.addEventListener('keydown', self.inputKeyDownHandler);
        self.inputEl.addEventListener('keyup',   self.inputKeyUpHandler);


        //DDL events
        self.ddlMouseupHandler = (e) =>
        {
            var clickedResult = closest(e.target, "." + ResultClass);
            if (clickedResult) 
            { 
                self.resultsEl.querySelector("." + FocusClass).classList.remove(FocusClass);   //Clear prev selected result
                clickedResult.classList.add(FocusClass);                                       //Select clicked result
                self.addSelectedResult(); 
            }
        };
        ddlEl.addEventListener('mouseup', self.ddlMouseupHandler);


        //Doc events
        self.docWheelHandler = (e) =>
        {
            if(!ddlEl.contains(e.target))  //If scrolling isn't on the DDL, close it
            {
                self.hideDDL();
            }
        };
        self.docMousedownHandler = (e) =>
        {
            var target = e.target;

            if (ctrlEl.contains(target))                           //If click was on the active control
            {
                self.focusInput();
            }
            else if (ddlEl.contains(target))                       //If click was on the DDL
            {
                var clickedResult = closest(target, "." + ResultClass);
                if (clickedResult)
                {
                    self.resultsEl.querySelector("." + FocusClass).classList.remove(FocusClass);   //Clear prev selected result
                    clickedResult.classList.add(FocusClass);                                       //Select clicked result
                }
                else { self.focusInput(); }
            }
            else { self.hideDDL(); }                               //Otherwise, close DDL
        };

        document.addEventListener('wheel', self.docWheelHandler);
        document.addEventListener('mousedown', self.docMousedownHandler);
    }


    removeEvents()
    {
        var self = this;
        self.inputEl.removeEventListener('keydown', self.inputKeyDownHandler);
        self.inputEl.removeEventListener('keyup',   self.inputKeyUpHandler);
        self.ddlEl.removeEventListener('mouseup', self.ddlMouseupHandler);
        document.removeEventListener('wheel', self.docWheelHandler);
        document.removeEventListener('mousedown', self.docMousedownHandler);
        self.docMousedownHandler = null;
        self.docWheelHandler     = null;
        self.ddlMouseupHandler   = null;
        self.inputKeyUpHandler   = null;
        self.inputKeyDownHandler = null;
    }

    open(ctrl)
    {
        var self = this;
        if (ctrl !== self.curCtrl)             //If a new ctrl is being opened...
        {
            if (self.curCtrl !== null)         //Set previously active ctrl to closed
            {
                self.curCtrl.setOpenState(false);
            }
            self.curCtrl = ctrl;               //Switch to new ctrl
            self.clearDDL();
            self.queryIfAllowedAndEnsureDDLVisible();
        }
        else if(self.ddlEl.classList.contains("cs-hidden")) //Same ctrl. Reload DDL if not already open
        {
            self.clearDDL();
            self.queryIfAllowedAndEnsureDDLVisible();
        }
    }

    focusInput()
    {
        setTimeout(()=> this.inputEl.focus(), 1);
    }

    clearDDL()
    {
        var c = this.curCtrl;
        this.resultsEl.innerHTML = '';
        this.inputEl.value = '';
        if (c)
        {
            c.lastInput       = '';
            c.filteredResults = null;
        }
    }

    showDDL()
    {
        var self = this;
        if(!self.isAttached)  //If ddl hasn't been appended to the document yet, add it
        {
            document.body.appendChild(self.ddlEl);
            self.isAttached = true;
        }

        self.ddlEl.classList.remove("cs-hidden");
        self.positionDDL();
        self.curCtrl.setOpenState(true);
        self.focusInput();
        self.wireEvents();
    }

    hideDDL()
    {
        this.ddlEl.classList.add("cs-hidden");
        if (this.curCtrl) { this.curCtrl.setOpenState(false); }
        this.removeEvents();
    }

    positionDDL()
    {
        var ctrlEl      = this.curCtrl.element,         //The DOM element for the control we are attaching this DDL to
            ctrlPos     = docOffset(ctrlEl),            //Coordinates relative to the document
            borderTop   = false,                        //DDL will either have a top or bottom border. (Depending on if it's positioned above or below the ctrl)
            ddl         = this.ddlEl,                   //The DDL element
            ctrlHeight  = ctrlEl.offsetHeight,          //Height of the control we're attached to
            y           = ctrlPos.top + ctrlHeight,     //Y position directly below ctrl
            wh          = window.innerHeight,           //Height of the browser viewport including, if rendered, the horizontal scrollbar
            topSpace    = ctrlPos.top,                  //Space available above ctrl
            botSpace    = (wh - y),                     //Space available below ctrl
            maxSpace    = Math.max(botSpace, topSpace), //Size of the larger space
            ddlStyle    = ddl.style;                    //Style of the drop down list


        //Set ddl left position / width
        ddlStyle.left   = ctrlPos.left + 'px';
        ddlStyle.width  = ctrlEl.offsetWidth + 'px';

        //Set scrollable area max-height
        this.resultsEl.style.maxHeight = (maxSpace - 45) + 'px';  //Subtract a bit to account for the input control and padding

        //If ddl would extend beyond the window assume it's better to show above the control *IF* topSpace has more room
        if ((y + ddl.offsetHeight) > wh)
        {
            if (topSpace > botSpace) //Top space has more room so put ddl above the ctrl
            {
                borderTop = true;
                y = ctrlPos.top - ddl.offsetHeight - 1;   //Position if above control (may not have ddl height correct @ this point, may need to call again after results render)
            }
        }

        //Set DDL top position
        ddlStyle.top = y + 'px';

        //Assign top/bottom border
        if(borderTop)
        {
            ddlStyle.borderTopStyle    = 'solid';
            ddlStyle.borderBottomStyle = 'none';
        }
        else
        {
            ddlStyle.borderBottomStyle = 'solid';
            ddlStyle.borderTopStyle    = 'none';
        }
    }

    setMsg(markup)
    {
        this.ddlElMsg.innerHTML = markup;
    }

    showBusy(b)
    {
        if (b) { this.inputElWrap.classList.add("cs-busy");    }
        else   { this.inputElWrap.classList.remove("cs-busy"); }
    }

    queryIfAllowedAndEnsureDDLVisible()
    {
        var self = this;
        if (self.canQuery())
        {
            self.queryTimerID = setTimeout(() => self.doQuery(), self.curCtrl.delay);
        }
        if (!self.curCtrl.isOpen) { self.showDDL(); }
    }

    canQuery()
    {
        var self        = this,
            charsNeeded = self.curCtrl.minChars - self.inputEl.value.length;

        self.cancelQuery();

        if (charsNeeded > 0)
        {
            self.setMsg("Enter " + charsNeeded + " more character(s)");
            return false;
        }

        self.showBusy(true);
        return true;
    }

    cancelQuery()
    {
        this.setMsg("");                                                //Remove working message
        if (this.queryTimerID) { clearTimeout(this.queryTimerID); }     //Stop query from running
    }

    doQuery()
    {
        var self        = this,
            searchTxt   = self.inputEl.value,
            c           = self.curCtrl,
            results, i;

        //Process result source...
        var isFunc = !Array.isArray(c.src);                      //Check if control's data source is an [] or function
        results    = isFunc ? c.src(searchTxt) : c.src;          //If it's a function run it passing the searchTxt, otherwise take the value as is.
        results    = Promise.resolve(results);                   //Ensure results are a promise if not already.


        //Clear any current filtered results
        c.filteredResults = null;   //Null tells renderResults() that results are pending.
        self.renderResults();

        //When promise has resolved
        results.then( (r) =>
        {
            if(isFunc)    //Assume if resultSrc was a function filtering of results has already been done.
            {
                c.filteredResults = r;
            }
            else          //If resultSrc wasn't a function perform basic filtering of results now
            {
                c.filteredResults = [];
                for (i = 0; i < r.length; i++)
                {
                    if (r[i][c.textProp].containsWords(searchTxt)) { c.filteredResults.push(r[i]); }
                }
            }
            self.renderResults();
        });
    }

    renderResults()
    {
        var self = this, c = self.curCtrl, d = c.filteredResults, markup, i = 1;

        //Check we're OK to display results
        if (!self.canQuery()) { return; }

        //Reposition the DDL after rendering, so position code knows the new height of the DDL
        setTimeout(() => self.positionDDL(), 0);

        //If d (filteredResults) is undefined...results are still pending
        if (!d)
        {
            self.showBusy(true);
            return;
        }

        //Clear results and any message
        self.setMsg('');
        self.resultsEl.innerHTML = '';
        self.showBusy(false);


        //If this is a control supporting multiple selected values, remove results that have already been selected
        if (c.values)
        {
            d.chsRemoveMatchingElements(c.idProp, c.values);
        }

        //Handle No Results
        if (d.length < 1) { self.setMsg('No matches'); return; }

        //Add 1st result as being "focused/selected"
        markup = "<li class='cs-ddl-result cs-focus' data-id='" + d[0][c.idProp] + "'><div class='cs-ddl-result-content'>" + self.renderResultContent(self, c, d[0]) + "</div></li>";

        //Add the remaining results
        for (; i < d.length; i++)
        {
            markup += "<li class='cs-ddl-result' data-id='" + d[i][c.idProp] + "'><div class='cs-ddl-result-content'>" + self.renderResultContent(self, c, d[i]) + "</div></li>";
        }
        self.resultsEl.innerHTML = markup;
    }


    renderResultContent(ddl, ctrl, obj)
    {
        var highlightedMarkup = ddl.getHighlightedMarkup(obj[ctrl.textProp]);                      //Get highlighted version of the object's text property

        if(ctrl.renderResultFn) {return ctrl.renderResultFn(ddl, ctrl, obj, highlightedMarkup); }  //If control has a custom render function for results, run it and return result
        return highlightedMarkup;                                                                  //Otherwise just return the highlighted text
    }


    getHighlightedMarkup(txt)
    {
        var searchTxt = this.inputEl.value.toLowerCase(),
            searchLen = searchTxt.length,
            matchIx   = txt.toLowerCase().indexOf(searchTxt),
            markup;

        if (matchIx < 0 || searchTxt.length < 1) { return encodeHtml(txt); }

        markup = encodeHtml(txt.substring(0, matchIx)) +
                "<span class='cs-ddl-result-highlight'>" +
                encodeHtml(txt.substring(matchIx, matchIx + searchLen)) +
                "</span>" +
                encodeHtml(txt.substring(matchIx + searchLen));

        return markup;
    }


    onInputKeyDown(evt)
    {
        var c = this.curCtrl, isOpen = c.isOpen, resultsEl = this.resultsEl, results, selectedResult, ix, newRes;

        switch (evt.keyCode)
        {
            case 40:  //Down
                if (isOpen)
                {
                    results = resultsEl.querySelectorAll("." + ResultClass);          //Get results
                    if(!results.length) {break;}

                    selectedResult = resultsEl.querySelector("." + FocusClass);       //Get currently selected result
                    selectedResult.classList.remove(FocusClass);                      //Remove selection class from prev selection

                    ix = getIndexOfNode(results, selectedResult) + 1;                 //Get index after selected result
                    if (ix >= results.length) { ix = 0; }                             //Wrap around as necessary

                    newRes = results[ix];                                             //Get new result
                    newRes.classList.add(FocusClass);                                 //Add selection class to newly selected result

                    if (!isInView(resultsEl, newRes, true))                           //If not totally visible, scroll to it
                    {
                        resultsEl.scrollTop = (newRes.offsetTop - resultsEl.offsetTop) + (newRes.offsetHeight - resultsEl.offsetHeight);
                    }
                    break;
                }
                c.lastInput = '';  //Cause prev input to not match current (which will cause a query on keyUp)
                break;

            case 38:  //Up
                if (isOpen)
                {
                    results        = resultsEl.querySelectorAll("." + ResultClass);   //Get results
                    if(!results.length) {break;}

                    selectedResult = resultsEl.querySelector("." + FocusClass);       //Get currently selected result
                    selectedResult.classList.remove(FocusClass);                      //Remove selection class from prev selection

                    ix = getIndexOfNode(results, selectedResult) - 1;                 //Get index before selected result
                    if (ix < 0) { ix = (results.length - 1); }                        //Wrap around as necessary

                    newRes = results[ix];                                             //Get new result
                    newRes.classList.add(FocusClass);                                 //Add selection class to newly selected result

                    if (!isInView(resultsEl, newRes, true))                           //If not totally visible, scroll to it
                    {
                        resultsEl.scrollTop = newRes.offsetTop - resultsEl.offsetTop;
                    }
                }
                break;

            case 27:  //ESC
                this.hideDDL(); c.element.focus();
                break;

            case 13:  //Enter
            case 9:   //Tab
                if (isOpen) { evt.preventDefault(); this.addSelectedResult(); }
                break;
        }
    }

    onInputKeyUp(evt)
    {
        var currentInput = this.inputEl.value;

        switch (evt.keyCode)
        {
            case  9:  //Tab
            case 13:  //Enter
            case 27:  //Esc
                return;
        }

        if (this.curCtrl.lastInput !== currentInput)   //Attempt a query if input has changed
        {
            this.curCtrl.lastInput = currentInput;
            this.queryIfAllowedAndEnsureDDLVisible();
        }
    }

    addSelectedResult()
    {
        var i               = 0,
            result          = this.resultsEl.querySelector("." + FocusClass),
            id              = Number(result.dataset.id),  //read data-id attribue
            obj             = null,
            c               = this.curCtrl,
            filteredResults = c.filteredResults;

        //Search thru filtered result objects to grab the one w/ the id matching the id on the selected result element
        for (; i < filteredResults.length; i++)
        {
            if (filteredResults[i][c.idProp] === id) { obj = filteredResults[i]; break; }
        }

        if (obj)
        {
            c.addSelectedItem(obj);

            this.hideDDL();
            setTimeout(()=>c.element.focus(), 1);
        }
    }
}



function getIndexOfNode(nodeList, node)  //returns the index of the node in the nodelist
{
    for(var i = 0; i < nodeList.length; i++)
    {
        if(nodeList[i] === node) { return i; }
    }
    return -1;
}


function isInView(container, el, fullyInView)   //Simplistic check if element is visible when inside a vertically scrolling parent
{
    var containerTop    = container.scrollTop,
        containerBottom = containerTop + container.offsetHeight,
        elTop           = docOffset(el).top + containerTop;

    if(container !== window)
    {
        elTop -= docOffset(container).top;
    }

    var elBottom = elTop + el.offsetHeight;
    if (fullyInView)
    {
        return ((containerTop <= elTop) && (containerBottom >= elBottom));  //Is element fully visible?
    }
    return ((elBottom >= containerTop) && (elTop <= containerBottom));      //Is element visible at all?
}