// ==UserScript==
// @name         Twitch Video Date Corrector
// @version      1.2
// @description  Correct Twitch video timestamp format
// @author       L
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to convert relative date to actual date in YYYY/MM/DD numerical form
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

    // Create a button to copy the date
    function createCopyButton(date) {
        const button = document.createElement("button");
        button.className = "ScCoreButton-sc-ocjdkq-0 ScCoreButtonSecondary-sc-ocjdkq-2 ibtYyW bTKXKk";
        button.setAttribute("aria-label", "Copy Date");
        button.innerHTML = `
            <div class="ScCoreButtonLabel-sc-s7h2b7-0 irroFV">
                <div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 phMMp">Copy Date~</div>
            </div>
        `;
        button.addEventListener("click", () => {
            copyToClipboard(date);
        });
        return button;
    }

    // Function to update timestamp element
    function updateTimestampElement(element) {
        const relativeDate = element.innerText.trim();
        if (/^\d+\s+days\s+ago$/.test(relativeDate)) {
            const actualDate = convertRelativeDateToActualDate(relativeDate);
            element.innerText = actualDate;

            const copyButton = createCopyButton(actualDate);
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "tw-flex";
            buttonContainer.appendChild(copyButton);

            const timestampContainer = element.parentElement;
            timestampContainer.style.display = "flex";
            timestampContainer.style.alignItems = "center";
            timestampContainer.appendChild(buttonContainer);
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

    console.log("Twitch Video Date Corrector script is running!");

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

})();
