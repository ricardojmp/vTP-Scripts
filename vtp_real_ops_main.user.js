// ==UserScript==
// @name        vTP REAL OPERATIONS - MAIN
// @namespace   Violentmonkey Scripts
// @match        https://vamsys.io/*
// @grant       none
// @version     1.0.0
// @author      Ricardo vTP
// @description Adds realistic operations to vTP Vamsys dashboard
// @updateURL    https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_main.user.js
// @downloadURL  https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_main.user.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = (s) => document.querySelectorAll(s);
    const rem = () => $('.booked-aircraft-flag').forEach(i => i.closest('div')?.remove());
    const inj = () => {
        const b = $('button[data-fc-type="dropdown"]')[0];
        if (b) {
            const s = b.querySelector('.md\\:flex.flex-col.gap-0\\.5.text-start.hidden');
            if (s && !s.innerHTML.includes('REAL OPERATIONS MODE')) {
                const r = document.createElement('span');
                r.className = 'text-xs';
                r.style.color = 'red';
                r.textContent = 'REAL OPERATIONS MODE';
                s.appendChild(r);
            }
        }
    };
    const hide = () => $('#jumpseat-button')[0]?.style.display = 'none';
    const msg = () => {
        const m = prompt('Enter a custom welcome message:', 'You are now running vTP REAL OPS Script');
        if (m) alert(m), localStorage.setItem('vTP_REAL_OPS_Welcome', 'true');
    };
    const high = () => {
        const i = $('div');
        i.forEach(item => {
            item.addEventListener('click', () => {
                i.forEach(i => i.style.backgroundColor = '');
                item.style.backgroundColor = '#D1E7DD';
            });
        });
    };
    const ref = () => {
        rem(), inj(), hide(), alert('Dropdown refreshed!');
    };
    const hClosest = () => {
        const t = $('.fi-ta-table')[0];
        if (!t) return console.log('No flight table found.');
        const r = t.querySelectorAll('tr');
        const now = new Date();
        let cT = null, cD = Infinity, cR = null, fN = '';
        const depIdx = Array.from(t.querySelectorAll('th')).findIndex(th => th.innerText.trim() === 'Departure');
        if (depIdx === -1) return console.log('Departure column not found.');
        const parseT = (txt, d) => {
            const [h, m] = txt.split(':').map(Number), dt = new Date(d);
            dt.setUTCHours(h, m, 0, 0);
            return dt;
        };
        r.forEach(row => {
            const cells = row.querySelectorAll('td');
            const depCell = cells[depIdx];
            if (depCell) {
                const depSpan = depCell.querySelector('.fi-ta-text-item-label');
                if (depSpan) {
                    const txt = depSpan.textContent.trim(), dt = parseT(txt, now);
                    const diff = dt - now;
                    if (diff >= 0 && diff < cD) {
                        cD = diff, cT = txt, cR = row;
                        const fCell = cells[0], fSpan = fCell.querySelector('.fi-ta-text-item-label');
                        fN = fSpan ? fSpan.textContent.trim() : 'Unknown Flight Number';
                    }
                }
            }
        });
        if (!cR) {
            const nD = new Date(now);
            nD.setUTCDate(nD.getUTCDate() + 1);
            r.forEach(row => {
                const cells = row.querySelectorAll('td');
                const depCell = cells[depIdx];
                if (depCell) {
                    const depSpan = depCell.querySelector('.fi-ta-text-item-label');
                    if (depSpan) {
                        const txt = depSpan.textContent.trim(), dt = parseT(txt, nD);
                        const diff = dt - now;
                        if (diff >= 0 && diff < cD) {
                            cD = diff, cT = txt, cR = row;
                            const fCell = cells[0], fSpan = fCell.querySelector('.fi-ta-text-item-label');
                            fN = fSpan ? fSpan.textContent.trim() : 'Unknown Flight Number';
                        }
                    }
                }
            });
        }
        if (cR) {
            const cells = cR.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.fontWeight = 'bold';
                cell.style.backgroundColor = '#C1E1C1';
            });
            console.log(`Closest Departure Time (UTC): ${cT}`);
            console.log(`Flight Number: ${fN}`);
        } else {
            alert('No upcoming departure times found.');
        }
    };

    if (!localStorage.getItem('vTP_REAL_OPS_Welcome')) msg();

    setTimeout(() => {
        rem();
        inj();
        high();
        hClosest();
    }, 2000);

    hide();

    const btn = document.createElement('button');
    btn.textContent = 'Refresh Dropdown';
    btn.style.margin = '10px';
    btn.addEventListener('click', ref);
    document.body.appendChild(btn);

    const ob = new MutationObserver(() => {
        rem();
        inj();
        hide();
    });
    ob.observe(document.body, { childList: true, subtree: true });
})();
