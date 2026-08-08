/**
 * Plesk / Phusion Passenger entrypoint for Next.js.
 * Uses next start so Passenger can inject PORT correctly.
 */
process.env.NODE_ENV = "production";

const { nextStart } = require("next/dist/cli/next-start");

nextStart({
  port: process.env.PORT || 3000,
  hostname: process.env.HOSTNAME || "0.0.0.0",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
