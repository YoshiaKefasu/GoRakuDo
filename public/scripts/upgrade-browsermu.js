/*
================================================================================
--- Browser Support Blocker (CRITICAL) ---

CORE GOAL:
This script checks for modern browser features. If the check fails, it blocks
the page with an upgrade message, now including browser icons from Font Awesome.

IMPLEMENTATION LOGIC:
1.  FEATURE DETECTION: Checks for `mask-image` support.
2.  DYNAMIC STYLESHEET INJECTION: If the check fails, this script now
    dynamically injects TWO stylesheets into the <head>: its own internal
    CSS AND the Font Awesome 7 CSS from a CDN.
3.  DYNAMIC HTML INJECTION: It then writes the blocker HTML, now with <i>
    icon tags, to the document.
================================================================================
*/
(function() {
    // --- Step 1: Feature Detection ---
    const isBrowserSupported = 
        window.CSS && 
        CSS.supports && 
        CSS.supports('mask-image', 'linear-gradient(to bottom, black, transparent)');

    if (isBrowserSupported) {
        return;
    }

    // --- Step 2: If Browser is NOT Supported, Prepare the Blocker ---

    // Define the CSS for the full-screen blocker overlay.
    const blockerCSS = `
        #browser-blocker {
            position: fixed;
            inset: 0;
            background-color: #0A0A0A;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif, system-ui;
            color: #FFFFFF;
            padding: 20px;
            text-align: center;
        }
        #browser-blocker-content {
            max-width: 600px;
        }
        #browser-blocker h1 {
            font-size: 28px;
            color: #FFFFFF;
            margin-bottom: 16px;
        }
        #browser-blocker p {
            font-size: 18px;
            color: #CCCCCC;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .browser-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .browser-links a {
            /* Use flexbox to align icon and text */
            display: inline-flex;
            align-items: center;
            gap: 10px; /* Space between icon and text */

            color: #FFFFFF;
            background-color: #8B5DFF;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }
        .browser-links a:hover {
            background-color: #7B4DEF;
        }
        /* Style for the icons themselves */
        .browser-links i {
            font-size: 1.2em; /* Makes icon slightly larger than text */
        }
    `;

    // Define the HTML for the message, now with Font Awesome icons.
    const blockerHTML = `
        <div id="browser-blocker">
            <div id="browser-blocker-content">
                <h1>Browser Anda Tidak Didukung</h1>
                <p>
                    Situs ini menggunakan teknologi web modern yang tidak dapat ditampilkan dengan benar oleh browser Anda. Untuk pengalaman terbaik dan keamanan, harap perbarui browser Anda.
                </p>
                <div class="browser-links">
                    <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-chrome"></i> Unduh Chrome
                    </a>
                    <a href="https://www.mozilla.org/firefox/new/" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-firefox-browser"></i> Unduh Firefox
                    </a>
                    <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-edge"></i> Unduh Edge
                    </a>
                </div>
            </div>
        </div>
    `;

    // --- Step 3: Inject the Blocker, STYLESHEETS, and Stop Page Loading ---

    // Create and inject the Font Awesome stylesheet link
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    // Using a reliable CDN for Font Awesome. The brand icons are available in the free version.
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    faLink.integrity = 'sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==';
    faLink.crossOrigin = 'anonymous';
    document.head.appendChild(faLink);

    // Create and inject the blocker's own internal styles
    const styleTag = document.createElement('style');
    styleTag.innerHTML = blockerCSS;
    document.head.appendChild(styleTag);

    // Write the blocker HTML directly into the document
    document.write(blockerHTML);

    // Stop the rest of the page from loading
    setTimeout(() => {
        try {
            window.stop();
        } catch (e) {
            console.error("Could not stop window loading:", e);
        }
    }, 100);
})();