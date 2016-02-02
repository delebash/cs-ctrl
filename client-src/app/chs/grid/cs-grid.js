import {customElement, bindable, bindingMode, processContent, children} from 'aurelia-framework';
import {closest, isFunc, addResizeListener, removeResizeListener, scrollbarWidth} from '../chs';

@customElement('cs-grid')
@children({name:'columns', selector: 'cs-col'}) //Creates [] property whose items are synced based on a query selector against the element's immediate child content.
export class CSGrid
{
    @bindable({defaultBindingMode: bindingMode.twoWay}) pgNum = 1;  //Current page#
    @bindable src           = null;                                 //Item source for rows
    @bindable pgSize        = 10;                                   //The number of records that can fit in a result page.
    
    static inject = [Element];
    constructor(element)
    {
        var self = this;
        self.element       = element; //<cs-grid> element
        self.isBusy        = false;   //Is grid busy querying data?
        self.rows          = [];      //Array of query result objects that get rendered as rows
        self.sortStr       = '';      //A SQL style order clause like "name" or "name desc" for the data

        self.totalCount    = 0;       //Total # of results
        self.selectedItems = [];      //Array of selected items

        self.setTotalCountMsg(0);     //Updates self.totalMsg to a string that's output in the footer for how many results there are
    }


    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    attached()
    {
        var self = this, el = self.element;

        //Allows consumer's to use $parent to access this vm. $parent.$parent.someProp will be on their normal context
        //self["$parent"] = bindingContext;

        //Store a refernce to the body element
        self.bodyEl = el.querySelector('.cs-grid-body');

        ///Can multiple rows be selected?
        self.isMultiSelect = el.hasAttribute('multiple');  
 
        //self.query();
        

        //Wire resize handling of control
        //self.resizeHandler = e => self.onResize(e);
        //addResizeListener(self.element, self.resizeHandler)

        //Gotta delay to ensure everything is rendered in DOM 1st
        // setTimeout(() =>
        // {
        //     self.sizeColumns();
        // });
    }

    detached()
    {
        var self = this;

        //Remove resize event listener
        //removeResizeListener(self.element, self.resizeHandler);
    }



    //Binding change handlers
    //-----------------------------------------------------------
    pgNumChanged() { this.query(); }
    


    //Event handlers
    //-----------------------------------------------------------
    onResize() { this.sizeColumns(); }
    
    
    //Actions
    //-----------------------------------------------------------
    insertRowTemplate(rowFrag)   //Adds the row template into the grid body
    {
        var self = this;
        //Create a row:      <div class="cs-grid-row" repeat.for="i of rows" click.delegate="$parent.onRowClick($event, i)"></div>
        var rowEl = document.createElement("div");
        rowEl.setAttribute("class", "cs-grid-row ${$first ? 'cs-first' : $last ? 'cs-last' : ''}");
        rowEl.setAttribute("repeat.for", "i of rows");
        rowEl.setAttribute("click.delegate", "$parent.onRowClick($event, i)");

        //Append the template cells into this row element
        var cellTemplates = rowFrag.childNodes;
        for (var i = 0, ii=cellTemplates.length; i < ii; i++)
        {
            if(cellTemplates[i].nodeType == 1)  //We only want the divs
            {
                var clone = cellTemplates[i].cloneNode(true);
                rowEl.appendChild(clone);
            }
        }

        //Create a template to hold this row
        var template = document.createElement('template');
        template.content.appendChild(rowEl);

        self.rowView = self.viewCompiler.compile(template, self.viewResources)  //Compile the template into a viewFactory
                                        .create(self.diContainer, self);        //Use the factory to create a view (container, executionCtx)

        //Add to DOM
        self.rowViewSlot = new ViewSlot(self.bodyEl, true, self);               //anchor, anchorIsContainer, executionCtx, animator
        self.rowViewSlot.add(self.rowView);
        self.rowViewSlot.attached();
    }

    deselectAllRows()
    {
        var allRows = this.bodyEl.querySelectorAll(".cs-grid-row");
        for(var r of allRows) { r.classList.remove("cs-active"); }
        this.selectedItems = [];
    }

    query()
    {
        var self = this, results;

        self.selectedItems = [];                                 //Clear previous selected items

        if(!self.src) { return; }

        var isFunc = isFunc(self.src);                           //Check if data source is a function
        if(isFunc)                                               //If it's a function run it
        {
            results = self.src({pgSize:self.pgSize, pgNum:self.pgNum, sort:self.sortStr});
        }
        else { results = self.src; }                             //Otherwise take the value as is


        if(!results.then) {results = Promise.resolve(results);}  //Ensure results are a promise if not already
        else                                                     //If we got a promise show busy animation until it resolves.
        {
            self.isBusy = true;
        }

        results.then(function(data)
        {
            var totalCount;
            self.rows = data || [];
            self.isBusy = false;

            if(self.rows.items)   //If we've got a client page object w/ {total,items} properties
            {
                self.rows  = data.items;
                totalCount = data.total;
                if(data.pgSize)            //Allow query results to optionally specify what pg size was used
                {
                    self.pgSize = data.pgSize;
                }
            }
            else                  //Just have an array
            {
                totalCount = self.rows.length;
            }

            self.setTotalCountMsg(totalCount);
            self.totalCount = totalCount;

            setTimeout(function()  //Give time for rows to render before sizing headers to match
            {
                self.sizeColumns();
            }, 1)
        });
    }


    sizeColumns()
    {
        var self = this, i;
        var headers        = self.headerRowEl.children;           //Header cells
        var headerCount    = headers.length-1;                    //Last header is empty. So the "real" header count is 1 less.
        var scrollHdrStyle = headers[headerCount].style;          //Grab last header's style

        if(self.rows.length)  //If rows are present we don't want flex headers because we'll assign their widths below based on the row widths
        {
            for (i = 0; i < headerCount; i++) { headers[i].style.flex = "none"; }
        }
        else                   //If there are no rows header cells must be flex 1, so they take up space
        {
            for (i = 0; i < headerCount; i++) { headers[i].style.flex = 1; headers[i].style.width = "auto"; }
            return;
        }

        var rowCells = self.bodyEl.querySelector(".cs-grid-row").children;    //Cells from the 1st body row

        //Set last header width to match the client's scrollbar width
        var isScrollVisible  = (self.bodyEl.scrollHeight > self.bodyEl.clientHeight);
        scrollHdrStyle.width = isScrollVisible ? scrollbarWidth + "px" : "0px";


        //Loop thru real headers setting them to be the width of the 1st body row's cells.
        for (i = 0; i < headerCount; i++)
        {
            headers[i].style.width = rowCells[i].offsetWidth + "px";
        }
    }

    sortByColumn(col)
    {
        var field = col.sortField;
        var dir   = col.sortDir;

        this.rows.sort(function(a,b)
        {
            return (((a[field] < b[field]) ? -1 : ((a[field] > b[field]) ? 1 : 0))) * dir;
        });
    }

    setTotalCountMsg(count)
    {
        var s;
             if(count == 0) { s = "No Results"; }
        else if(count == 1) { s = "1 Result";   }
        else                { s = count + " Results"; }

        this.totalMsg = s;
    }

    removeItem(item)
    {
        var rows = this.rows;
        var ix = rows.indexOf(item);
        if(ix >= 0)
        {
            rows.splice(ix,1);
            this.setTotalCountMsg(rows.length);
        }
    }
}
