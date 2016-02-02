import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('cs-pager')
@bindable({name              : 'pgNum',                 //Current page#
           attribute         : 'pg-num',
           changeHandler     : 'pgNumChanged',
           defaultBindingMode: bindingMode.twoWay,
           defaultValue      : 1
})
export class CsPager
{
    @bindable maxLinks  =  5;    //Max # of page links to show
    @bindable total     =  0;    //Total # of items
    @bindable pgSize    = 10;    //Number of items shown per page
    @bindable center    = true;  //Should current page be displayed in the center of visible ones?
    @bindable endLinks  = true;  //Display first/last page links?
    @bindable nextLinks = true;  //Display prev/next page links?
    
    static inject = [Element];
    constructor(element)
    {
        this.element = element;
        this.visible = true;     //Show the pager?
    }
    
    
    //Lifecycle events
    //--------------------------------------------------------------------------------
    bind()
    {
        this.ondemand = this.element.hasAttribute('ondemand'); //Hides pager if totalPages <= 1
           
        this.buildPageLinks();
    }
    
    
    //Binding change handlers
    //--------------------------------------------------------------------------------
    pgNumChanged(newVal)    { this.buildPageLinks(); }
    totalChanged(newVal)    { this.buildPageLinks(); }
    pgSizeChanged(newVal)   { this.buildPageLinks(); }
    
    
    //Event handlers
    //--------------------------------------------------------------------------------
    onClick(e)
    {
        var el = e.target, cl = el.classList;
        if(cl.contains("cs-pager-link") && !cl.contains("cs-disabled"))
        {
            this.pgNum = el.dataset.pg;  //Grab pgNum from link
        }
    }
    
    
    
    //Actions
    //--------------------------------------------------------------------------------
    buildPageLinks()
    {
        var self      = this, 
            maxLinks  = Number(self.maxLinks), //Cast bindables because they can come in as a string if entered in html.
            curPg     = Number(self.pgNum),    //Future ver of Aurelia should allow a datatype to be set on the binding.
            pgSize    = Number(self.pgSize),
            total     = Number(self.total),
            pageLinks = [];
        
        //Calc total pages
        var totalPages  = pgSize < 1 ? 1 : Math.ceil(total / pgSize);
        totalPages      = Math.max(totalPages || 0, 1);
        self.totalPages = totalPages;
        
        //Calc start/end page
        var startPg = 1, endPg = totalPages;
        
        //If there's a max # of pageLinks we can display
        if(maxLinks)
        {
            if(self.center)    //If current page is displayed in the center of visible ones
            {
                startPg = Math.max(curPg - Math.floor(maxLinks / 2), 1);
                endPg   = startPg + maxLinks - 1;
                
                //Adjust if we went beyond the total pages
                if (endPg > totalPages)
                {
                    endPg   = totalPages;
                    startPg = endPg - maxLinks + 1;
                    if(startPg < 1) { startPg = 1; }
                }
            }
            else              //Show new page range at multiples of maxLinks
            {
                startPg = ((Math.ceil(curPg / maxLinks) - 1) * maxLinks) + 1;
                endPg   = Math.min(startPg + maxLinks - 1, totalPages);
            }
        }
        
        //Add page number links
        for(var num = startPg; num <= endPg; num++)
        {
            var link = self.makeLink(num, num, num===curPg);
            pageLinks.push(link);
        }
        
        //Add ... links to move between page sets
        if (maxLinks && !self.center)
        {
            if (startPg > 1)
            {
                var prevPageSet = self.makeLink(startPg - 1, '...', false);
                pageLinks.unshift(prevPageSet);
            }

            if (endPg < totalPages)
            {
                var nextPageSet = self.makeLink(endPg + 1, '...', false);
                pageLinks.push(nextPageSet);
            }
        }
        
        //Set previous/next link values
        self.noPrevious = ((curPg-1) < 1);          //Should prev link be disabled?
        self.noNext     = ((curPg+1) > totalPages); //Should next link be disabled?
        self.prevPgNum  = curPg-1;
        self.nextPgNum  = curPg+1;
        
        self.pageLinks = pageLinks;
        
        //Set visibility
        if(self.ondemand)
        {
            self.visible = (totalPages > 1);
        }
    }

    makeLink(number, text, isActive)
    {
        var pg = 
        {
            number: number,
            text  : text,
            active: isActive
        };
        return pg;
    }     
}