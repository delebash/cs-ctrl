//Find matches function supported by browser
function getMatchFn()
{
    var arrMatch = ['matches','msMatchesSelector'];
    for(var i = 0; i < arrMatch.length; i++)
    {
        if (typeof document.body[arrMatch[i]] == 'function')
        {
            return arrMatch[i];
        }
    }
}
var _matchesFn = getMatchFn();



//jQuery replacements
//======================================================================================================
export function docOffset(el)  //Returns element coordinates relative to the document origin
{
    var rect = el.getBoundingClientRect();
    var offset =
    {
        top : rect.top  + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    };
    return offset;
}
export function closest(el, selector)
{
    //Starting w/ the given element, traverse up thru parents for a selector match
    var testEl = el;
    while (testEl !== null)
    {
        if (testEl[_matchesFn](selector)) { return testEl; }
        testEl = testEl.parentElement;
    }

    return null;
}
//======================================================================================================


export var transitionEndEvent = (function() 
{
    var t, el = document.createElement('div');

    var transitions = 
    {
        'transition'      : 'transitionend',
        'MozTransition'   : 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'OTransition'     : 'oTransitionEnd'
    };

    for (t in transitions) 
    {
        if (el.style[t] !== undefined) { return transitions[t]; }
    }
})();





export function encodeHtml(txt)
{
    return txt.replace(/&/g, '&amp;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');

}

export function isAlphaNumericKey(keyCode)
{
    var r = (keyCode > 47 && keyCode < 58) || // Number keys
            (keyCode > 64 && keyCode < 91);   // Letter keys
    return r;
}



export function isFunc(obj)
{
    return (typeof obj === 'function');
}







//String helpers
//---------------------------------------------------------------------------------
if (!isFunc(String.prototype.containsWords))
{
    String.prototype.containsWords = function (searchTxt) //True if all of the tokens in the search text are found in the string
    {
        var str      = this.toLowerCase(),
            lcSearch = searchTxt.toLowerCase();

        var searchWords = lcSearch.split(' ');
        if (searchWords.length === 0) { return true; }

        for (var i = 0; i < searchWords.length; i++)
        {
            if (str.indexOf(searchWords[i]) === -1) { return false; }
        }
        return true;
    };
}


//Array helpers
//---------------------------------------------------------------------------------
if (!isFunc(Array.prototype.chsRemoveMatchingElements))
{
    Array.prototype.chsRemoveMatchingElements = function (fieldToTest, arr)     //Removes all elements in the array matching an element in the given array
    {
        var i, x = 0;

        for (; x < arr.length; x++)                  //Go thru items in given array
        {
            for (i = this.length - 1; i >= 0; i--)   //Go backwards thru this array's items
            {
                if (this[i][fieldToTest] === arr[x][fieldToTest]) { this.splice(i, 1); }
            }
        }
        return this;
    };
}


if (!isFunc(Array.prototype.chsRemoveWithPropertyVal))
{
    Array.prototype.chsRemoveWithProperty = function (fieldToTest, val)     //Removes all elements in the array w/ the given property value
    {
        for (var i = this.length - 1; i >= 0; i--)   //Go backwards thru this array's items
        {
            if (this[i][fieldToTest] === val) { this.splice(i, 1); }
        }

        return this;
    };
}


/**Returns a new [] made from the values of a single field*/
Array.prototype.chsToScalar = function (curFieldName = "id")  
{
    var arr = [];
    for (var i = 0, ii = this.length; i < ii; i++)
    {
        arr.push(this[i][curFieldName]);
    }
    return arr;
};

export function getSiblings(el, filter)
{
    var sibs = [];
    
    el = el.parentNode.firstChild;
    do
    {
        if (!filter || filter(el))  { sibs.push(el); }
    } while (el = el.nextSibling)
    return sibs;
}


export function getTabbables(parentEl)
{
    var i = 0, tabs = [], elements = parentEl.getElementsByTagName("*"), elLength = elements.length, el;

    for (; i < elLength; i++)
    {
        el = elements[i];
        if( isHidden(el) || el.disabled || el.tabindex < 0)  { continue; }

        //Elements of the following type are tabbable if they do not have a negative tab index and are not disabled
        if(el.nodeName === "INPUT" || el.nodeName === "SELECT" || el.nodeName === "TEXTAREA" || el.nodeName === "BUTTON" || el.nodeName === "OBJECT")
        {
            tabs.push(el); continue;
        }

        //Anchors are focusable if they have an href or positive tabindex attribute
        if(el.nodeName === "A")
        {
            if(el.href || el.tabindex >= 0) { tabs.push(el);  }
            continue;
        }

        //Other elements are tabbable based on their tabindex attribute and visibility
        if(el.tabindex >= 0) { tabs.push(el); }
    }

    return tabs;
}

export function isHidden(el)
{
    return (el.offsetParent === null);  //http://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
}


//------------Element Resize Detection-------------------
export function addResizeListener(el, fn)
{
    if (!el._CHS_resizeHandlers)      //If there are no resize event handlers on this element yet...
    {
        el._CHS_resizeHandlers = [];  //Add an array to the element to hold handler functions

        //The element's position can't be static because we're going to absolutely position an <object> inside it to fill its space
        if (getComputedStyle(el).position == 'static') { el.style.position = 'relative'; }

        //Create an unclickable <object> inside the element taking all space
        var obj = el._CHS_resizeObj = document.createElement('object');
        obj.setAttribute('style', 'display:block;position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:-1;');
        obj.onload = function()
        {
            this.contentDocument.defaultView._CHS_resizeOrigEl = el;
            this.contentDocument.defaultView.addEventListener('resize', resizeListener);
        };
        obj.type = 'text/html';
        obj.data = 'about:blank';
        el.appendChild(obj);
    }
    el._CHS_resizeHandlers.push(fn);  //Add fn to list of functions to call when the element is resized
}

function resizeListener(e)
{
    var obj = e.target;
    if (obj._CHS_frameID) { cancelAnimationFrame(obj._CHS_frameID); }  //Cancel any previous requestedFrame

    //Request to be called back before the next repaint.
    obj._CHS_frameID = window.requestAnimationFrame(function()
    {
        var origEl = obj._CHS_resizeOrigEl;
        origEl._CHS_resizeHandlers.forEach(function(fn)
        {
            fn.call(origEl, e);  //Call each of the event handler functions about the resize (with *this* being the original element)
        });
        obj._CHS_frameID = null;
    });
}

export function removeResizeListener(el, fn)
{
    el._CHS_resizeHandlers.splice(el._CHS_resizeHandlers.indexOf(fn), 1);  //Remove the fn from the list of handlers
    if (!el._CHS_resizeHandlers.length)                                    //If there's no more resizeHandlers left
    {
        if(el._CHS_resizeObj.contentDocument)                              //When done in aurelia detached() the object's contentDocument is no longer available :(
        {
            el._CHS_resizeObj.contentDocument.defaultView.removeEventListener('resize', resizeListener);  //Remove the event from the object
        }
        el.removeChild(el._CHS_resizeObj);                                                            //Remove the object from the element
        delete el._CHS_resizeObj;                                                                     //Remove obj reference
        delete el._CHS_resizeHandlers;                                                                //Remove handlers array
    }
}
//-----------------------------------------------------


export var scrollbarWidth = (function()
{
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; //Needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;

    //Force scrollbars
    outer.style.overflow = 'scroll';

    //Add innerdiv
    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    //Remove divs
    outer.parentNode.removeChild(outer);

    return (widthNoScroll - widthWithScroll);
})();



/*
export function extend(out)
{
    out = out || {};

    for (var i = 1; i < arguments.length; i++)
    {
        var obj = arguments[i];

        if (!obj) { continue; }

        for (var key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                if (typeof obj[key] === 'object') { extend(out[key], obj[key]); }
                else                              { out[key] = obj[key];        }
            }
        }
    }

    return out;
}*/



// export function copy(obj)
// {
//     var myCopy;

//     // Handle the 3 simple types, and null or undefined
//     if (null === obj || "object" != typeof obj) return obj;

//     // Handle Date
//     if (obj instanceof Date)
//     {
//         myCopy = new Date();
//         myCopy.setTime(obj.getTime());
//         return myCopy;
//     }

//     // Handle Array
//     if (obj instanceof Array)
//     {
//         myCopy = [];
//         for (var i = 0, len = obj.length; i < len; i++)
//         {
//             myCopy[i] = copy(obj[i]);
//         }
//         return myCopy;
//     }

//     // Handle Object
//     if (obj instanceof Object)
//     {
//         myCopy = {};
//         for (var attr in obj)
//         {
//             if (obj.hasOwnProperty(attr)) myCopy[attr] = copy(obj[attr]);
//         }
//         return myCopy;
//     }

//     throw new Error("Unable to clone object. Its type isn't supported.");
// }





// var chsIDCount = 0;  //Counter of the chsIDs that have been issued so far.
// export function chsID()
// {
//     return (++chsIDCount);
// }

//Common keycodes
// export var keyCode =
// {
//     BACKSPACE: 8,
//     DELETE: 46,
//     DOWN: 40,
//     END: 35,
//     ENTER: 13,
//     ESCAPE: 27,
//     HOME: 36,
//     LEFT: 37,
//     PAGE_DOWN: 34,
//     PAGE_UP: 33,
//     RIGHT: 39,
//     SPACE: 32,
//     TAB: 9,
//     UP: 38
// };