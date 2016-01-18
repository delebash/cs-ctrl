import {notify} from '../../chs/notify/notify';

export class Notify
{
    success()
    {
        notify.success('success');
    }
    
    error()
    {
        notify.error('error');
    }
    
    info()
    {
        notify.info('info');
    }
}