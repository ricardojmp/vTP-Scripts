// ==UserScript==
// @name         vTP REAL OPERATIONS - MAIN
// @namespace    http://violentmonkey.net/
// @version      1.0.1    // Updated version number
// @description  Filter dropdown items, show welcome message, inject "REAL OPERATIONS MODE" into dropdown, hide the Jumpseat button, customizable welcome message, button to refresh dropdown, highlight selected item, highlight closest departure row, show flight number for closest departure time and display them as bold text with custom color in the existing cells of the row.
// @match        https://vamsys.io/*
// @grant        none
// @updateURL    https://firebasestorage.googleapis.com/v0/b/vtp-scripts.appspot.com/o/vtp_real_ops_main.user.js?alt=media&token=5088d3fa-a7ce-4239-9dfd-1230a41ca26c
// @downloadURL  https://firebasestorage.googleapis.com/v0/b/vtp-scripts.appspot.com/o/vtp_real_ops_main.user.js?alt=media&token=5088d3fa-a7ce-4239-9dfd-1230a41ca26c
// ==/UserScript==

// Filter Dropdown, Welcome Message, Inject Text, Hide Jumpseat Button, Highlight Closest Departure Row, Show Flight Number
 
(function() {
    'use strict';
 
    // Function to remove dropdown items with 'booked-aircraft-flag' class
    function removeBookedAircraftItems() {
        const items = document.querySelectorAll('.booked-aircraft-flag');
        items.forEach(item => {
            const parentDiv = item.closest('div'); // Finds the parent div of the flagged item
            if (parentDiv) {
                parentDiv.remove(); // Remove the entire dropdown item
            }
        });
    }

    // Function to inject "REAL OPERATIONS MODE" span if it's missing
    function injectRealOperationsMode() {
        const button = document.querySelector('button[data-fc-type="dropdown"]'); // Select the dropdown button

        if (button) {
            const spanContainer = button.querySelector('.md\\:flex.flex-col.gap-0\\.5.text-start.hidden'); // Find the main span container

            if (spanContainer && !spanContainer.innerHTML.includes('REAL OPERATIONS MODE')) {
                // Create the new span element for "REAL OPERATIONS MODE"
                const realOpsSpan = document.createElement('span');
                realOpsSpan.className = 'text-xs';  // Assign the class
                realOpsSpan.style.color = 'red';   // Add the red color
                realOpsSpan.textContent = 'REAL OPERATIONS MODE';

                // Append the new span to the existing span container
                spanContainer.appendChild(realOpsSpan);
            }
        }
    }

    // Function to hide the Jumpseat button
    function hideJumpseatButton() {
        const jumpseatButton = document.getElementById('jumpseat-button');
        if (jumpseatButton) {
            jumpseatButton.style.display = 'none'; // Set the display to none
        }
    }

    // Function to show customizable welcome message
    function showWelcomeMessage() {
        const customMessage = prompt('Enter a custom welcome message:', 'You are now running vTP REAL OPS Script');
        if (customMessage !== null) {
            alert(customMessage);
            localStorage.setItem('vTP_REAL_OPS_Welcome', 'true'); // Set a flag to indicate the message has been shown
        }
    }

    // Function to highlight selected dropdown item
    function highlightSelectedItem() {
        const items = document.querySelectorAll('div'); // Adjust selector to match dropdown items
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.style.backgroundColor = ''); // Clear previous highlights
                item.style.backgroundColor = '#D1E7DD'; // Highlight the clicked item
            });
        });
    }

    // Function to refresh dropdown
    function refreshDropdown() {
        removeBookedAircraftItems();
        injectRealOperationsMode();
        hideJumpseatButton();
        alert('Dropdown refreshed!');
    }

    // Function to highlight the row with the closest departure time and show flight number
    function highlightClosestDepartureRow() {
        const table = document.querySelector('.fi-ta-table'); // Select the table
        if (!table) {
            console.log('No flight table found.');
            return; // Exit if table is not found
        }

        const rows = table.querySelectorAll('tr'); // Get all rows in the table
        const currentTimeUTC = new Date(); // Get current time in UTC
        let closestTime = null;
        let closestDiff = Infinity; // Initialize with a large number
        let closestRow = null; // Variable to hold the closest row element
        let flightNumber = ''; // Variable to hold the flight number

        // Get the index of the departure time column
        const headerCells = table.querySelectorAll('th');
        let departureTimeIndex = Array.from(headerCells).findIndex(th =>
            th.innerText.trim() === 'Departure'
        );

        if (departureTimeIndex === -1) {
            console.log('Departure column not found.');
            return; // Exit if the departure column is not found
        }

        // Function to parse departure time and return it as a Date object
        function parseDepartureTime(timeText, date) {
            const [hours, minutes] = timeText.split(':').map(Number);
            const departureDate = new Date(date);
            departureDate.setUTCHours(hours, minutes, 0, 0);
            return departureDate;
        }

        // First pass: Check for flights on the current day
        rows.forEach(row => {
            const cells = row.querySelectorAll('td'); // Get all cells in the current row
            const departureCell = cells[departureTimeIndex]; // Select the cell corresponding to the departure time

            if (departureCell) {
                const departureSpan = departureCell.querySelector('.fi-ta-text-item-label'); // Select departure time element within the cell

                if (departureSpan) {
                    const timeText = departureSpan.textContent.trim();
                    const departureDate = parseDepartureTime(timeText, currentTimeUTC); // Use current date for comparison

                    // Calculate the difference in milliseconds
                    const diff = departureDate - currentTimeUTC;

                    // Only consider future times
                    if (diff >= 0 && diff < closestDiff) {
                        closestDiff = diff;
                        closestTime = timeText; // Update closest time
                        closestRow = row; // Update closest row

                        // Extract flight number from the same row
                        const flightNumberCell = cells[0]; // Assuming flight number is in the first cell
                        const flightNumberSpan = flightNumberCell.querySelector('.fi-ta-text-item-label');
                        flightNumber = flightNumberSpan ? flightNumberSpan.textContent.trim() : 'Unknown Flight Number';
                    }
                }
            }
        });

        // Second pass: If no valid future times found, check for the first flight on the next day
        if (!closestRow) {
            const nextDayUTC = new Date(currentTimeUTC);
            nextDayUTC.setUTCDate(nextDayUTC.getUTCDate() + 1); // Move to the next day

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const departureCell = cells[departureTimeIndex];

                if (departureCell) {
                    const departureSpan = departureCell.querySelector('.fi-ta-text-item-label');

                    if (departureSpan) {
                        const timeText = departureSpan.textContent.trim();
                        const departureDate = parseDepartureTime(timeText, nextDayUTC); // Use next day for comparison

                        const diff = departureDate - currentTimeUTC;

                        if (diff >= 0 && diff < closestDiff) {
                            closestDiff = diff;
                            closestTime = timeText;
                            closestRow = row;

                            const flightNumberCell = cells[0];
                            const flightNumberSpan = flightNumberCell.querySelector('.fi-ta-text-item-label');
                            flightNumber = flightNumberSpan ? flightNumberSpan.textContent.trim() : 'Unknown Flight Number';
                        }
                    }
                }
            });
        }

        // Highlight the closest row if found
        if (closestRow) {
            const closestCells = closestRow.querySelectorAll('td');
            closestCells.forEach(cell => {
                cell.style.fontWeight = 'bold'; // Set font weight to bold
                cell.style.backgroundColor = '#C1E1C1'; // Change text color to green
            });

            console.log(`Closest Departure Time (UTC): ${closestTime}`);
            console.log(`Flight Number: ${flightNumber}`);
        } else {
            alert('No upcoming departure times found.');
        }
    }

    // Show welcome message on first visit
    if (!localStorage.getItem('vTP_REAL_OPS_Welcome')) {
        showWelcomeMessage();
    }

    // Run the dropdown filter function after a delay (in case content loads dynamically)
    setTimeout(() => {
        removeBookedAircraftItems();
        injectRealOperationsMode();
        highlightSelectedItem(); // Highlight selected item
        highlightClosestDepartureRow(); // Highlight the closest departure row and show flight number
    }, 2000); // Adjust delay if needed

    // Hide the Jumpseat button
    hideJumpseatButton();

    // Create a refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Dropdown';
    refreshButton.style.margin = '10px';
    refreshButton.addEventListener('click', refreshDropdown);
    document.body.appendChild(refreshButton); // Append refresh button to body

    // Optional: Detect dynamic changes to the dropdown and rerun both functions if necessary
    const observer = new MutationObserver(() => {
        removeBookedAircraftItems();
        injectRealOperationsMode();
        hideJumpseatButton(); // Ensure the Jumpseat button remains hidden
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
