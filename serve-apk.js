const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const APK_PATH = path.join(__dirname, 'FitPulse-AI.apk');

const server = http.createServer((req, res) => {
  if (req.url === '/download' || req.url === '/FitPulse-AI.apk') {
    if (!fs.existsSync(APK_PATH)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('APK not found');
      return;
    }
    const stat = fs.statSync(APK_PATH);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="FitPulse-AI.apk"'
    });
    fs.createReadStream(APK_PATH).pipe(res);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Download FitPulse AI</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090d16; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90vh; margin: 0; text-align: center; padding: 20px; }
        .card { background: #131b2e; padding: 32px 24px; border-radius: 24px; max-width: 380px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); border: 1px solid #1e293b; }
        .logo { font-size: 48px; margin-bottom: 12px; }
        h1 { color: #38bdf8; margin: 0 0 8px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        p { color: #94a3b8; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5; }
        a.btn { display: block; background: linear-gradient(135deg, #0284c7, #0369a1); color: white; text-decoration: none; padding: 16px 20px; border-radius: 14px; font-weight: 700; font-size: 17px; box-shadow: 0 4px 15px rgba(2,132,199,0.4); }
        .steps { margin-top: 24px; text-align: left; background: #0a0f1d; padding: 16px; border-radius: 12px; font-size: 13px; color: #cbd5e1; border: 1px solid #1e293b; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">⚡️</div>
        <h1>FitPulse AI App</h1>
        <p>Complete Android App with zero version errors</p>
        <a class="btn" href="/download">⬇️ Download & Install APK</a>
        <div class="steps">
          <b>⚡️ 3 Simple Steps:</b><br>
          1. Tap <b>Download APK</b> button above<br>
          2. Tap the downloaded file<br>
          3. Tap <b>Install</b> and open!
        </div>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Direct APK server running on http://192.168.18.64:${PORT}`);
});
