import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 45000, fullyParallel: false, workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5185', channel: 'msedge', headless: true, viewport: {width:1440,height:960}, trace:'retain-on-failure' },
  webServer: { command:'npm run dev',url:'http://127.0.0.1:5185',reuseExistingServer:true,timeout:30000 },
});
