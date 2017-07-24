import Vue from 'vue';

Vue.directive('inline-textbox', {
    inserted(el)
    {
        let clone = document.createElement('div');

        // clone class list
        clone.classList = el.classList;

        // add some important styling
        clone.style.whiteSpace = 'pre';
        clone.style.position   = 'fixed';
        clone.style.left       = '-999999px';

        // calculate padding
        let style        = window.getComputedStyle(el, null),
            paddingLeft  = parseInt(style.getPropertyValue('padding-left').slice(0, -2)),
            paddingRight = parseInt(style.getPropertyValue('padding-right').slice(0, -2)),
            padding      = paddingLeft + paddingRight;

        // insert clone after element itself
        el.parentNode.insertBefore(clone, el);

        // add some event listeners, yo
        el.onchange = el.oninput = el.onpaste = function() {
            clone.innerText = el.value;
            el.style.width  = (clone.offsetWidth - padding) + 'px';
        };

        // call the event listener once to initialize the correct width
        el.onchange();
    }
});