
const Sitemap = () => {
    return null;
};

export const getServerSideProps = async ({ res }) => {
    const BASE_URL = 'http://bundle.love';

    const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <!-- created with Free Online Sitemap Generator www.xml-sitemaps.com -->
    
    
    <url>
      <loc>https://www.bundle.love/</loc>
      <lastmod>2022-07-31T19:34:10+00:00</lastmod>
    </url>
    
    
    </urlset>
  `;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default Sitemap;