export class App
{
    configureRouter(config, router)
    {
        config.title = 'vn2016';
        //config.options.pushState = true;
        config.map([
            { route: ['', 'notify'], name: 'notify',  moduleId: '../notify/notify',   nav:true, title: 'Notify'},
            { route: 'pager',        name: 'pager',   moduleId: '../pager/pager',     nav:true, title: 'Pager'},
            { route: 'date',         name: 'date',    moduleId: '../date/date-ex',    nav:true, title: 'Date'},
            { route: 'select',       name: 'select',  moduleId: '../select/select',   nav:true, title: 'Select'},
            { route: 'mselect',      name: 'mselect', moduleId: '../mselect/mselect', nav:true, title: 'Multi-Select'},
            { route: 'win',          name: 'win',     moduleId: '../win/win',         nav:true, title: 'Windows'},
            { route: 'tabs',         name: 'tabs',    moduleId: '../tabs/tabs',       nav:true, title: 'Tabs'},
            { route: 'tabs',         name: 'tabs',    moduleId: '../tabs/tabs',       nav:true, title: 'Tabs'},
            { route: 'grid',         name: 'grid',    moduleId: '../grid/grid',       nav:true, title: 'Grid'},
        ]);
        
        this.router = router;
    }
}