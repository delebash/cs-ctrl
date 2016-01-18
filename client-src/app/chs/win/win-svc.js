import {Container, CompositionEngine} from 'aurelia-framework';
import {EventAggregator}              from 'aurelia-event-aggregator';
import {closest}                      from '../chs';
import {WinController}                from './win-controller';
import {CsWin}                        from './cs-win';

export class WinSvc
{
    static inject = [EventAggregator, CompositionEngine, Container];
    constructor(eventAggregator, compositionEngine, container)
    {
        var self               = this;
        self.eventAggregator   = eventAggregator;
        self.compositionEngine = compositionEngine;
        self.container         = container;

        self.windows           = [];     //Array of running windows (CsWin references)
        self.activeWindow      = null;   //The currently focused window

        wireEventHandlers(self);


        //Register to be notified when a window is closed.
        eventAggregator.subscribe(CsWin.event.closed, closedWin =>
        {
            if(self.activeWindow === closedWin) { self.activeWindow = null; }              //If the window that closed was the active one, set activeWindow=null

            for (var i = 0, ii = self.windows.length; i < ii; i++)                         //Remove the window from the array of windows
            {
                if (closedWin === self.windows[i]) { self.windows.splice(i, 1); break; }
            }
        });
    }

    createVM(viewModelPath, data, overrideOps)
    {
        var self           = this;
        var winController  = new WinController(overrideOps);
        var childContainer = self.container.createChild(); 
        
        //Register this specific winController instance to be used for injecting into the component we are creating
        childContainer.registerInstance(WinController, winController);
        
        var compositionContext = 
        {
            viewModel     : viewModelPath,
            container     : self.container,
            childContainer: childContainer,
            model         : data
        };
        
        //Ensures that the view model and its resources are loaded for this context
        return self.compositionEngine.ensureViewModel(compositionContext).then(updatedCompositionContext =>
        {            
            //Create a controller instance for the component described in the context
            return self.compositionEngine.createController(updatedCompositionContext).then(controller =>
            {
                //Note: At this point CsWin has been constructed and assigned a reference to itself on winController 
                var csWin = winController.csWin;
                
                //Store useful stuff in winController so it's accecable via injection to CsWin & its content (caller as well)
                winController.controller = controller;       
                winController.view       = controller.view;
                winController.viewModel  = controller.viewModel;
                                
                controller.automate();                       //Bind controller & View (Note: subject to change https://github.com/aurelia/templating/blob/master/src/controller.js#L69)
                self.windows.push(csWin);                    //Add window to the window collection
                self.activeWindow = csWin;                   //Make this new window the active one   
                csWin.addToDom();                            //Tell window to add itself to the DOM
                
                return Promise.resolve(winController);       //Resolve winController for caller
            });
        });
    }
}


//Wire mousedown events on document to set/remove focus on windows appropriately
function wireEventHandlers(winSvc)
{
    document.addEventListener('mousedown', (ev) =>
    {
        var win = closest(ev.target, '.cs-win')

        if (win)                              //Window clicked on
        {
            var i = 0, winList = winSvc.windows, windowCount = winList.length;
            for (; i < windowCount; i++)
            {
                if (winList[i].element === win)
                {
                    if(winList[i] != winSvc.activeWindow)
                    {
                        winSvc.activeWindow = winList[i];
                        winList[i].moveToTop();
                        winList[i].focusTabbable();
                    }
                    return;
                }
            }
        }
        winSvc.activeWindow = null;             //No window was clicked
    });
}