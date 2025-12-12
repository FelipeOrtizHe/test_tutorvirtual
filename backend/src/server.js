import app from './app.js';
import { config } from './config/env.js';

const { port, appName } = config;

app.listen(port, () => {
  // Visible startup log to confirm configuration
  console.log(`${appName} escuchando en http://localhost:${port}`);
});
