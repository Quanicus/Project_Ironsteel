import "./components/htmx-modal.js";
import "./components/side-nav.js";
import "./components/mail-app.js";
import "./components/icon-nav.js";
import "./components/profile-icon.js";
import "./components/tab-display.js";


import "./components/scroll-element.js";
import "./components/shad-modal.js";
import "./components/shad-textarea.js";

import "./components/scroll-bar.js";
import "./components/shad-button.js";
import "./components/shad-input-text.js";
import "./components/shad-toggle.js";
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
        threshold: 0.01 
    };

    // Create an IntersectionObserver instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll(".particle-intersector")
    .forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const scrollContainer = document.querySelector(".scroll-container");
    const intersectingElements = document.querySelector("particle-canvas").intersectingElements;
    const lightSrc = document.querySelector(".blood-skull");

    
    const updateShadow = () => {
        intersectingElements.forEach(intersector => {
            const lightRect = lightSrc.getBoundingClientRect();
            const intersectRect = intersector.getBoundingClientRect();

            const lightSrcX = lightRect.left + lightRect.width/2;
            const lightSrcY = lightRect.top + lightRect.height/2;
            const intersectorX = intersectRect.left + intersectRect.width/2;
            const intersectorY = intersectRect.top + intersectRect.height/2;

            const deltaX = (intersectorX - lightSrcX) / scrollContainer.clientHeight;
            const deltaY = (intersectorY - lightSrcY) / scrollContainer. clientWidth;
            //console.log(deltaX, deltaY);
            const shadowX = 
            intersector.style.textShadow = `
                calc(1rem * ${deltaX}) calc(1rem * ${deltaY}) 0.4rem rgba(0,0,0,0.8),
                calc(3px * ${-deltaX}) calc(3px * ${-deltaY}) red
            `;
        });
    }
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.01 
    };
    const handleLightIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollContainer.addEventListener("scroll", updateShadow);
            } else {
                scrollContainer.removeEventListener("scroll", updateShadow);
            }
        })
    }
    const lightObserver = new IntersectionObserver(handleLightIntersection, observerOptions);
    lightObserver.observe(lightSrc);
    //scrollContainer.addEventListener("scroll", updateShadow);
})





