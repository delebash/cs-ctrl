export function configure(aurelia)
{
    aurelia.globalResources([                       //Register resources globally
                            // './svg-vc',                             
                            // './date-vc',
                            // '../chs/cs-enter',
                            // '../chs/grid/cs-grid',
                             '../chs/pager/cs-pager',
                             '../chs/select/cs-select',
                             '../chs/mselect/cs-mselect',
                             '../chs/date/cs-date',
                             '../chs/win/cs-win',
                             '../chs/tabs/cs-tabs',
                             '../chs/tabs/cs-tab'
                            ]);
}
