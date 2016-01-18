//Acts as a container for data to be injected into CsWin and or the VM inside CsWin and manages window's result promise
export class WinController
{
    constructor(options)
    {
        var self           = this;
        self.options       = options;
        self.controller    = null;       
        self.WinController = null;
        self.viewModel     = null;
        self.csWin         = null;
        
        //Promise for window's result
        self.pResult = new Promise( (resolve,reject) =>
        {
            self.resultResolveFn = resolve;
            self.resultRejectFn  = reject;
            self.resultFulfilled = false;
        });
    }
    
    ok(val)     //Resolve's pResult if not already fulfilled & closes window
    {
        var self = this;
        if(!self.resultFulfilled)
        {
            self.resultFulfilled = true;
            self.resultResolveFn(val);
            self.csWin.close();
        }   
    }
    
    cancel(val)  //Reject's pResult if not already fulfilled & closes window
    {
        var self = this;
        if(!self.resultFulfilled)
        {
            self.resultFulfilled = true;
            self.resultRejectFn(val);
            self.csWin.close();
        }
    }
    
    
    busy(msg)
    {
        this.csWin.busy(msg);
    }
    
    ready()
    {
        this.csWin.ready();
    }
}