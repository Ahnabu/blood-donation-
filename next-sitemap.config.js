/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXTAUTH_URL || "https://yourdomain.com",
    generateRobotsTxt: true,
    exclude: ["/dashboard/*", "/api/*", "/login", "/register", "/unauthorized"],
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/dashboard/", "/api/", "/unauthorized"] },
        ],
    },
    additionalPaths: async () => [
        { loc: "/", changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() },
        { loc: "/blood-types", changefreq: "monthly", priority: 0.9 },
        { loc: "/how-it-works", changefreq: "monthly", priority: 0.8 },
        { loc: "/find-donor", changefreq: "daily", priority: 0.9 },
        { loc: "/blog", changefreq: "weekly", priority: 0.7 },
    ],
};

module.exports = config;
