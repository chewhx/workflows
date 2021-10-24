const Imap = require("imap");

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

module.exports = imap;
