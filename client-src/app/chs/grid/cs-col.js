import {customElement} from 'aurelia-framework';

@customElement('cs-col')
export class CSCol
{    
    static Direction = 
    {
        Descending: -1,
        None      :  0,
        Ascending :  1
    };

    static inject = [Element];
    constructor(element)
    {
        //Set properties from the template row for this column (colEl)
        var self       = this;
        self.element   = element;
        self.sortDir   = CSCol.Direction.None;
        self.header    = element.getAttribute('header'); 
        
        //self.style     = colEl.getAttribute('h-style');
        //self.baseClass = 'cs-grid-th';                             //Class list before sorting direction applied

        //Add any given class
        //var givenClass = colEl.getAttribute('h-class');
        //if(givenClass) { self.baseClass += ' ' + givenClass; }

        //If sorting allowed on this column, add the sortable class
        //if(self.sortField)  { self.baseClass += ' cs-sort'; } 

        //Class list including a possible sort direction
        //self.allClass = self.baseClass;
    }

    toggleSort()
    {
        var self = this;
        self.sortDir = (self.sortDir==CSCol.Direction.Ascending) ? CSCol.Direction.Descending : CSCol.Direction.Ascending;
        self.updateClasses();
    }

    updateClasses()
    {
        var self = this;

        self.allClass = self.baseClass;

             if(self.sortDir == CSCol.Direction.Descending) { self.allClass += " cs-desc"; }
        else if(self.sortDir == CSCol.Direction.Ascending)  { self.allClass += " cs-asc";  }
    }
    
    //Removes sorting direction from column if present
    clearSort()
    {
        var self = this;
        if(self.sortDir != CSCol.Direction.None)
        {
            self.sortDir = CSCol.Direction.None;
            self.updateClasses();
        }
    }


    getSortString()
    {
        var s = this.sortField;
        return (this.sortDir == CSCol.Direction.Descending) ? (s + " DESC") : s; 
    }
}