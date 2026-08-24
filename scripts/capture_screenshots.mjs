import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('public/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log('Spawning Chrome with remote debugging...');
  const tmpProfile = path.resolve('public/screenshots/tmp-profile');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tmpProfile}`,
    '--disable-gpu',
    '--window-size=1440,900',
    '--no-first-run',
    'http://localhost:3000/login'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const pages = await listRes.json();
  const wsUrl = pages[0]?.webSocketDebuggerUrl;
  console.log('Connected to target:', wsUrl);

  const ws = new WebSocket(wsUrl);
  await new Promise((res) => ws.onopen = res);

  let idCounter = 1;
  function call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const onMsg = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', onMsg);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await call('Page.enable');
  await call('Runtime.enable');

  // 1. Capture Login
  console.log('Capturing Slide 5: Login Page...');
  await call('Page.navigate', { url: 'http://localhost:3000/login' });
  await new Promise((r) => setTimeout(r, 1500));
  let shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'slide5_login.png'), Buffer.from(shot.data, 'base64'));

  // 2. Set LocalStorage & Capture Dashboard
  console.log('Capturing Slide 6: Dashboard Page...');
  await call('Runtime.evaluate', {
    expression: `
      localStorage.setItem('auth_token', 'dummy-token-user-001');
      localStorage.setItem('auth_user', JSON.stringify({
        id: 'user-001',
        name: 'Admin User',
        email: 'admin@ainoc.com',
        role: 'admin'
      }));
      window.location.href = '/dashboard';
    `
  });
  await new Promise((r) => setTimeout(r, 2500));
  shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'slide6_dashboard.png'), Buffer.from(shot.data, 'base64'));

  // 3. Capture Topology Canvas
  console.log('Capturing Slide 7: Topology Page...');
  await call('Page.navigate', { url: 'http://localhost:3000/topology' });
  await new Promise((r) => setTimeout(r, 3000));
  shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'slide7_topology.png'), Buffer.from(shot.data, 'base64'));

  // 4. Click a node to open Device Detail Drawer
  console.log('Capturing Slide 8: Device Detail Drawer...');
  await call('Runtime.evaluate', {
    expression: `
      const rtr = document.querySelector('.react-flow__node');
      if (rtr) rtr.click();
    `
  });
  await new Promise((r) => setTimeout(r, 1500));
  shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'slide8_device_detail.png'), Buffer.from(shot.data, 'base64'));

  ws.close();
  chromeProcess.kill();
  console.log('Screenshots saved successfully!');
}

capture().catch(console.error);
