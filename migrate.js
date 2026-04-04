const fs = require('fs');
const path = require('path');

// --- UPDATE INDEX.HTML ---
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// 1. Remove large style block and replace with link to style.css + specific index styles
// We just need to keep specific index styles like .selector-row, .converter-row, etc. in a new file or inline, but it's okay to just leave specific ones inline or move them to style.css.
// Actually, it's easier to just move all index-specific styles to src/style.css which we already did!
// Let's replace the whole style block in index.html with a simple link and the layout specifics.

const newStyles = `<link rel="stylesheet" href="src/style.css">
  <style>
    /* Index specific */
    .selector-row { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .select-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .select-group label { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    select, input[type="text"] { background: var(--input-bg); border: 1px solid var(--card-border); color: var(--text-main); font-family: inherit; padding: 0.75rem 1rem; border-radius: 12px; font-size: 1rem; outline: none; transition: all 0.3s ease; width: 100%; }
    select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
    select:focus, input[type="text"]:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
    .converter-row { margin-bottom: 1.5rem; position: relative; }
    .converter-row label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
    .input-wrapper { position: relative; display: flex; align-items: center; }
    .symbol-prefix { position: absolute; left: 1rem; font-size: 1.2rem; color: var(--text-muted); font-family: 'Space Grotesk', sans-serif; pointer-events: none; }
    .converter-row input { font-family: 'Space Grotesk', monospace; font-size: 1.5rem; font-weight: 700; padding: 1rem 1rem 1rem 2.5rem; height: 64px; background: rgba(0,0,0,0.2); }
    .unit-badge { background: rgba(255,255,255,0.08); padding: 0.3rem 0.6rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; pointer-events: none; }
    .price-ticker { margin-top: 2rem; text-align: center; padding-top: 1.5rem; border-top: 1px solid var(--card-border); }
    .price-ticker p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .live-price { font-family: 'Space Grotesk', monospace; font-size: 2rem; font-weight: 700; color: var(--accent); text-shadow: 0 0 15px var(--accent-glow); transition: color 0.5s ease; }
    .sats-per-dollar { margin-top: 1rem; text-align: center; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399; padding: 0.75rem; border-radius: 12px; font-weight: 600; font-size: 0.9rem; animation: pulse 2s infinite ease-in-out; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
    .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--accent); color: #000; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 700; opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 1000; box-shadow: 0 10px 25px var(--accent-glow); }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .custom-inputs { display: flex; gap: 0.5rem; margin-top: 0.5rem;}
    .custom-inputs input { padding: 0.6rem 1rem; font-size: 0.85rem; background: rgba(0,0,0,0.2); }
    @media (max-width: 480px) { .glass-card { padding: 1.5rem; border-radius: 20px; } .converter-row input { font-size: 1.25rem; } }
  </style>`;

// Replace <style> block completely
indexHtml = indexHtml.replace(/<style>[\s\S]*?<\/style>/, newStyles);

// Change Header Title
const oldHeader = `<h1>シ SBC<span class="beta-badge">v9</span></h1>`;
const newHeader = `<h1><a href="index.html" style="text-decoration:none">シ Satoshi Bitcoin Converter</a></h1>
    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:-1.2rem; font-weight:600;">v9</p>`;
indexHtml = indexHtml.replace(oldHeader, newHeader);

fs.writeFileSync(indexPath, indexHtml);

// --- UPDATE PAGES ---
const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const pageHeaderTemplate = `
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../src/style.css">
`;

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Remove w3school css
    html = html.replace(/<link rel="stylesheet" href="https:\/\/www\.w3schools\.com\/w3css\/4\/w3\.css">/g, '');
    
    // Inject fonts and style.css in head
    if (html.includes('<head>')) {
        html = html.replace('</head>', pageHeaderTemplate + '\n</head>');
    }

    // Remove inline styles entirely
    html = html.replace(/<style>[\s\S]*?<\/style>/g, '');
     
    // Remove old header with button
    html = html.replace(/<center>[\s\S]*?<\/center>/, `
    <header>
      <h1><a href="../index.html">シ Satoshi Bitcoin Converter</a></h1>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-top:-1.2rem; font-weight:600;">v9</p>
    </header>
    `);
    
    html = html.replace(/<a href="\.\.\/index\.html" class="w3-button.*?<\/a><br>/, '');

    // Wrap body content in glass-card
    // Find body
    const bodyStartMatch = html.match(/<body.*?>/);
    if (bodyStartMatch) {
       const bodyStart = bodyStartMatch[0];
       let contents = html.substring(html.indexOf(bodyStart) + bodyStart.length, html.lastIndexOf('</body>'));
       
       // Just wrap the raw content (which doesn't have the old center header anymore because we replaced it above)
       const newBody = `
<main class="page-container">
  <div class="glass-card">
    <div style="text-align: center; margin-bottom: 2rem;">
        <a href="../index.html" class="home-btn">← Back to Converter</a>
    </div>
    ${contents}
  </div>
</main>`;
       html = html.substring(0, html.indexOf(bodyStart) + bodyStart.length) + newBody + html.substring(html.lastIndexOf('</body>'));
    }

    fs.writeFileSync(filePath, html);
});

console.log("Migration complete!");
