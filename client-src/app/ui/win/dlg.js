import {WinController} from '../../chs/win/win-controller';
import {WinSvc}        from '../../chs/win/win-svc';

export class Dlg
{
    static inject = [WinController, WinSvc];
    constructor(winController, winSvc)
    {
        this.title         = 'Demo Window';
        this.busyTxt       = '';
        this.winController = winController;
        this.winSvc        = winSvc;
        this.canClose      = true;
    }
    
    ok()
    {
        this.winController.ok(this.title);
    }
    
    cancel()
    {
        if(this.canClose) { this.winController.cancel('canceled'); }
    }
    
    blockUI()
    {
        var self = this;
        self.winController.busy("Blocking for five secs...");
        
        setTimeout(function() 
        {
            self.winController.ready();
        }, 5000);
    }
    
    
    open(isModal = false)
    {
        this.winSvc.createVM('app/ui/win/dlg', 123, {modal: isModal});
    }
    
    
    //Life cycle
    activate(model)
    {
        console.log('dlg: activate ' + model);
    }
    created()
    {
        console.log('dlg: created');
    }
    bind()
    {
        console.log('dlg: bind');
    }
    attached()
    {
        console.log('dlg: attached');
    }
    windowShown(csWin)
    {
        console.log('dlg: windowShown');
        this.winController.ready();       //UnblockUI and clear busy msg
    }
    windowClosing(csWin)
    {
        console.log('dlg: windowClosing');
        return this.canClose;
    }
    detached()
    {
        console.log('dlg: detached');
    }
    unbind()
    {
        console.log('dlg: unbind');
    }
    
    
    
}