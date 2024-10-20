// ==UserScript==
// @name         vTP REAL OPS - DISPATCH
// @namespace   Violentmonkey Scripts
// @namespace    http://violentmonkey.net/
// @version      1.0.0
// @description  Injects a "Maintenance Notes" section after the "Route" section in the page.
// @match        https://vamsys.io/phoenix/flight-center/booking/*
// @updateURL    https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_dispatch.user.js
// @downloadURL  https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_dispatch.user.js
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to inject the "Maintenance Notes" section after the "Route" section
    function injectMaintenanceNotes() {
        // Find all sections with the 'card' class
        const cardSections = document.querySelectorAll('.card');

        cardSections.forEach(section => {
            // Look for the exact "Route" section by checking the h4 title
            const routeTitle = section.querySelector('h4.card-title');
            if (routeTitle && routeTitle.textContent.trim() === 'Route') {
                // Create the "Maintenance Notes" section
                const maintenanceNotes = document.createElement('div');
                maintenanceNotes.innerHTML = `
                    <div class="card mb-4">
                        <div class="card-header flex justify-between items-center">
                            <h4 class="card-title">Maintenance Notes</h4>
                            <div>ETLB</div>
                        </div>
                        <div class="px-6 py-2 space-y-2">
                            <div class="flex flex-col">
                                <p class="text-gray-400" style="font-weight: bold;color: red;">MEL ITEMS</p>
                                <div class="mt-1 w-fit">
                                  <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center;">
                                    <span style="color: red;">32-42-01A - Main Wheel Brake INOP</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right-square-fill" viewBox="0 0 16 16" style="color: red; margin-left:5px">
                                        <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707"></path>
                                    </svg>
                                  </a>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                // Insert the "Maintenance Notes" section after the "Route" section
                section.parentNode.insertBefore(maintenanceNotes, section.nextSibling);
            }
        });
    }

    // Run the function after the page has loaded
    setTimeout(injectMaintenanceNotes, 2000); // Adjust delay if needed to account for dynamic content loading
})();





