import {customElement, bindable, children} from 'aurelia-framework';

@customElement('cs-tabs')
@children({name:'tabs', selector: 'cs-tab'}) //Creates [] property whose items are synced based on a query selector against the element's immediate child content.
export class CsTabs
{
    static inject = [Element];
    constructor(element)
    {
        this.element   = element;
        this.activeTab = null;
    }

    //Binding event handlers
    //--------------------------------------------------------
    tabsChanged()
    {
        var self = this;
        if(self.tabs.length > 0)                                          //Try and select a tab if we have any...
        {
            if(!self.activeTab || self.tabs.indexOf(self.activeTab)==-1)  //...and one is not already selected
            {
                self.selectTab(self.tabs[0]);
            }
        }
    }


    //Actions
    //--------------------------------------------------------
    selectTab(tab)
    {
        var self = this;
        if(self.activeTab) { self.activeTab.show(false); }  //Hide prev selected tab

        self.activeTab = tab;                               //Track the given tab as the new active one
        if(tab) { tab.show(true); }                         //Show the given tab (unless we were passed null)
    }
}
