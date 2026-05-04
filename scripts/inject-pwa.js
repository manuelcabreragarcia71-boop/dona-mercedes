const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const pwaTags = `
  <link rel="manifest" href="/manifest.json" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Doña Mercedes" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
`;

html = html.replace('</head>', pwaTags + '</head>');
fs.writeFileSync(indexPath, html);
console.log('PWA meta tags injected successfully');
