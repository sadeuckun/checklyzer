export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL gerekli.' });
  const apiKey = process.env.PAGESPEED_API_KEY || '';
  try {
    const getScore = async (strategy) => {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return {
        score: Math.round((data.lighthouseResult.categories.performance.score || 0) * 100),
        fcp: data.lighthouseResult.audits['first-contentful-paint'].displayValue,
        lcp: data.lighthouseResult.audits['largest-contentful-paint'].displayValue
      };
    };
    const mobile = await getScore('mobile');
    const desktop = await getScore('desktop');
    res.status(200).json({
      mobileScore: mobile.score,
      desktopScore: desktop.score,
      fcp: mobile.fcp,
      lcp: mobile.lcp
    });
  } catch (e) {
    res.status(500).json({ error: 'Analiz başarısız.' });
  }
} 