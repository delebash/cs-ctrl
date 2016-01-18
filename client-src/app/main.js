export function configure(aurelia) 
{
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('app/res');           //Register application resources in res folder

    init(aurelia);
        
    aurelia.start().then(() => aurelia.setRoot('app/ui/app/app'));
}


//Application's startup code
function init(aurelia)
{
    //Prevent the backspace key from navigating back
    document.addEventListener('keydown', function (event)
    {
        if (event.keyCode === 8) //Backspace
        {
            var el = event.srcElement || event.target;
            var tagName = el.tagName.toUpperCase();
            if (tagName === 'INPUT')
            {
                var inputType = el.type.toUpperCase();
                if (inputType === 'TEXT' || inputType === 'PASSWORD' || inputType === 'FILE')
                {
                    if (el.readOnly || el.disabled) { event.preventDefault(); }
                }
            }
            else if (tagName === 'TEXTAREA')
            {
                if (el.readOnly || el.disabled) { event.preventDefault(); }
            }
            else
            {
                event.preventDefault();
            }
        }
    });
}