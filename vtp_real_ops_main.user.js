// ==UserScript==
// @name        vTP REAL OPERATIONS - MAIN
// @namespace   Violentmonkey Scripts
// @match       https://vamsys.io/*
// @grant       none
// @version     1.0
// @author      Ricardo vTP
// @description Adds realistic operations to vTP Vamsys dashboard
// @updateURL   https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_main.user.js
// @downloadURL https://github.com/ricardojmp/vTP-Scripts/raw/refs/heads/master/vtp_real_ops_main.user.js
// ==/UserScript==

(function() {
    'use strict';

    function a() {
        document.querySelectorAll('.booked-aircraft-flag').forEach(b => {
            const c = b.closest('div');
            if (c) c.remove();
        });
    }

    function d() {
        const e = document.querySelector('button[data-fc-type="dropdown"]');
        const f = e?.querySelector('.md\\:flex.flex-col.gap-0\\.5.text-start.hidden');
        if (f && !f.innerHTML.includes('REAL OPERATIONS MODE')) {
            const g = document.createElement('span');
            g.className = 'text-xs';
            g.style.color = 'red';
            g.textContent = 'REAL OPERATIONS MODE';
            f.appendChild(g);
        }
    }

    function h() {
        const i = document.getElementById('jumpseat-button');
        if (i) i.style.display = 'none';
    }

    function j() {
        const k = prompt('Enter a custom welcome message:', 'You are now running vTP REAL OPS Script');
        if (k) alert(k);
        localStorage.setItem('vTP_REAL_OPS_Welcome', 'true');
    }

    function l() {
        document.querySelectorAll('div').forEach(m => {
            m.addEventListener('click', () => {
                document.querySelectorAll('div').forEach(n => n.style.backgroundColor = '');
                m.style.backgroundColor = '#D1E7DD';
            });
        });
    }

    function o() {
        const p = document.querySelector('.fi-ta-table');
        if (!p) return;

        const q = p.querySelectorAll('tr');
        const r = new Date();
        let s = null, t = Infinity, u = '';

        const v = Array.from(p.querySelectorAll('th')).findIndex(w => w.innerText.trim() === 'Departure');
        if (v === -1) return;

        function x(y, z) {
            const [A, B] = y.split(':').map(Number);
            const C = new Date(z);
            C.setUTCHours(A, B);
            return C;
        }

        q.forEach(D => {
            const E = D.querySelectorAll('td')[v];
            if (E) {
                const F = E.querySelector('.fi-ta-text-item-label')?.textContent.trim();
                if (F) {
                    const G = x(F, r);
                    const H = G - r;
                    if (H >= 0 && H < t) {
                        t = H;
                        s = D;
                        u = D.querySelector('td:first-child .fi-ta-text-item-label')?.textContent.trim() || 'Unknown Flight Number';
                    }
                }
            }
        });

        if (s) {
            s.querySelectorAll('td').forEach(I => {
                I.style.fontWeight = 'bold';
                I.style.backgroundColor = '#C1E1C1';
            });
            console.log(`Closest Departure Time (UTC): ${s.querySelector('td:nth-child(2) .fi-ta-text-item-label').textContent.trim()}`);
            console.log(`Flight Number: ${u}`);
        } else {
            alert('No upcoming departure times found.');
        }
    }

    if (!localStorage.getItem('vTP_REAL_OPS_Welcome')) j();
    setTimeout(() => {
        a();
        d();
        l();
        o();
    }, 2000);

    h();
    const J = document.createElement('button');
    J.textContent = 'Refresh Dropdown';
    J.style.margin = '10px';
    J.onclick = () => {
        a();
        d();
        h();
        alert('Dropdown refreshed!');
    };
    document.body.appendChild(J);

    const K = new MutationObserver(() => {
        a();
        d();
        h();
    });
    K.observe(document.body, { childList: true, subtree: true });
})();
