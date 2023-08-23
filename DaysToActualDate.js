// ==UserScript==
// @name         Twitch Video Date Correction
// @namespace    idk what to put here
// @version      0.8
// @description  show the actual date in YYYY-MM-DD numerical form.
// @author       L
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to convert relative date to actual date in YYYY-MM-DD numerical form
    function convertRelativeDateToActualDate(relativeDate) {
        const now = new Date();
        const numRegex = /\d+/;
        const daysAgo = parseInt(relativeDate.match(numRegex)[0]);
        const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    // Function to update timestamp element
    function updateTimestampElement(element) {
        const relativeDate = element.innerText.trim();
        if (/^\d+\s+days\s+ago$/.test(relativeDate)) {
            const actualDate = convertRelativeDateToActualDate(relativeDate);
            element.innerText = actualDate;
        }
    }

    // Observe changes in the DOM and apply updates to new timestamp elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const timestampElements = addedNode.querySelectorAll('p.CoreText-sc-1txzju1-0.CGSoI');
                    timestampElements.forEach(updateTimestampElement);
                }
            });
        });
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Twitch Video Date Correction script is observing!");

})();