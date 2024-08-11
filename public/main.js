import "./components/htmx-modal.js";
import "./components/side-nav.js";
import "./components/mail-app.js";
import "./components/icon-nav.js";
import "./components/profile-icon.js";
import "./components/tab-display.js";

import "./components/scroll-container.js"

import "./components/scroll-bar.js";
import "./components/shad-button.js";
import "./components/shad-input-text.js";
import "./components/shad-input-toggle.js";
import "./components/shad-tooltip.js";

document.body.addEventListener('htmx:beforeSwap', function(evt) {
    if(evt.detail.xhr.status === 404){
        // alert the user when a 404 occurs (maybe use a nicer mechanism than alert())
        alert("Error: Could Not Find Resource");
    } else if(evt.detail.xhr.status === 422){
        // allow 422 responses to swap as we are using this as a signal that
        // a form was submitted with bad data and want to rerender with the
        // errors
        //
        // set isError to false to avoid error logging in console
        evt.detail.shouldSwap = true;
        evt.detail.isError = false;
    } else if(evt.detail.xhr.status === 418){
        // if the response code 418 (I'm a teapot) is returned, retarget the
        // content of the response to the element with the id `teapot`
        evt.detail.shouldSwap = true;
        evt.detail.target = htmx.find("#teapot");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const intersectSet = document.querySelector("particle-canvas").intersectingElements;
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                intersectSet.add(entry.target);
            } else {
                intersectSet.delete(entry.target);
            }
        });
    };

    // Define options (optional)
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.01 // Trigger callback when 50% of the target is visible
    };

    // Create an IntersectionObserver instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll(".particle-intersector")
    .forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const scrollContainer = document.querySelector("scroll-container")
        .shadowRoot.querySelector(".scroll-container");
    scrollContainer.scrollTop = innerHeight;
    scrollContainer.addEventListener("scroll", () => {
        if (scrollContainer.scrollTop < innerHeight) {
            scrollContainer.scrollTop = innerHeight;
        }
    })
})





