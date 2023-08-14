const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

(async () => {
  const pages = [
    { url: '/', changefreq: 'daily', priority: 0.7 },
    { url: '/gift-idea-generator', changefreq: 'monthly', priority: 0.3 },
    { url: '/[userID]', changefreq: 'monthly', priority: 0.7 },
  ];

  const stream = new SitemapStream({ hostname: 'https://givebundl.com' });
  pages.forEach((page) => stream.write(page));
  stream.end();
  const sitemap = await streamToPromise(stream).then((sm) => sm.toString());

  fs.writeFileSync('./public/sitemap.xml', sitemap);
})();