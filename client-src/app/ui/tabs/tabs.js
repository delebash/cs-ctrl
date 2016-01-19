export class Tabs
{
    constructor()
    {
        this.myValue  = "A-B-C";
        this.tabCount = 5;
        this.tabs     = [];
    }

    addTab()
    {
        this.tabs.push({});
    }

    removeTab()
    {
        if(this.tabs.length) { this.tabs.splice(0, 1); }
    }
}
