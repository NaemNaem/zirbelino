/**
 * Plesk / Phusion Passenger entrypoint for Next.js.
 * Local/Vercel continue to use `next start` via package.json.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  if (typeof PhusionPassenger !== "undefined") {
    // eslint-disable-next-line no-undef
    PhusionPassenger.configure({ autoInstall: false });
    server.listen("passenger");
    return;
  }

  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
