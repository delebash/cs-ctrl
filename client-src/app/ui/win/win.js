import {WinSvc} from '../../chs/win/win-svc';

export class Win
{
    static inject = [WinSvc];
    constructor(winSvc)
    {
        this.winSvc = winSvc;
    }
    
    open(isModal = false)
    {
        this.winSvc.createVM('app/ui/win/dlg', 123, {modal: isModal});
    }
   
}