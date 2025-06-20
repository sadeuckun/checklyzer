const tls = require('tls');
import { apiGuard, clearApiGuard } from '../../lib/apiGuard';

export default async function handler(req, res) {
  if (!(await apiGuard(req, res))) return;
  const { url: siteUrl } = req.query;
  if (!siteUrl) return res.status(400).json({ error: 'URL gerekli.' });
  try {
    const { hostname } = new URL(siteUrl);
    const socket = tls.connect(443, hostname, { servername: hostname, timeout: 5000 }, () => {
      const cert = socket.getPeerCertificate();
      const valid = cert.valid_to && new Date(cert.valid_to) > new Date();
      res.status(200).json({
        ssl: !!cert.subject,
        valid,
        validTo: cert.valid_to,
        protocol: socket.getProtocol()
      });
      socket.end();
      clearApiGuard(req);
    });
    socket.on('error', () => {
      res.status(200).json({ ssl: false, valid: false });
      clearApiGuard(req);
    });
    socket.setTimeout(5000, () => {
      res.status(200).json({ ssl: false, valid: false });
      socket.end();
      clearApiGuard(req);
    });
  } catch (e) {
    clearApiGuard(req);
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 