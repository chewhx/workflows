const Imap = require("imap");
const Promise = require("bluebird");

const imapConfig = {
  user: process.env.EMAIL_ADDRESS,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

const imap = new Imap(imapConfig);
Promise.promisifyAll(imap);

module.exports = imap;
