import { config } from '../config/env.js';

export function getStatus(req, res) {
  res.json({
    service: config.appName,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
