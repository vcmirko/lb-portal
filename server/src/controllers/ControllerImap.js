import fs from 'fs';
import path from 'path';
import Imap from 'imap';
import config from '../config.js';
import { simpleParser } from 'mailparser';

import * as msal from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: config.azure_app.clientId,
    authority: config.azure_app.authority,
    clientSecret: config.azure_app.clientSecret
  },
};

const rules = config.loonbrieven.rules;

// Set SKIP_IMAP_PROCESSING=true in .env to skip file saving and mail moving (useful for testing)
const SKIP_IMAP_PROCESSING = process.env.SKIP_IMAP_PROCESSING === 'true';

const tokenRequest = {
  scopes: ['https://outlook.office365.com/.default'],
};

const _build_XOAuth2_token = (user = '', access_token = '') => Buffer.from([`user=${user}`, `auth=Bearer ${access_token}`, '', ''].join('\x01'), 'utf-8').toString('base64');

async function getToken(tokenRequest) {
  const cca = new msal.ConfidentialClientApplication(msalConfig);
  return await cca.acquireTokenByClientCredential(tokenRequest);
}

function extractYear(source, yearRegex) {
  const match = source && source.match(new RegExp(yearRegex));
  return match ? match[0] : String(new Date().getFullYear());
}

function getVersionedFilePath(basePath, filename, log) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  let filePath = path.join(basePath, filename);
  let version = 2;
  while (fs.existsSync(filePath)) {
    const cleanName = name.replace(/\(v\d+\)$/, '');
    const newFilename = `${cleanName}(v${version})${ext}`;
    filePath = path.join(basePath, newFilename);
    version++;
    log(`File already exists, trying new version: ${newFilename}`);
  }
  return filePath;
}

export default {
  import: async () => {

    function log(t) {
      console.log(t);
    }

    log('Starting import process');

    try {
      log('get token');
      const authResponse = await getToken(tokenRequest);
      var token = authResponse.accessToken;
      log(`Loading mails`);
      const imap = new Imap({
        xoauth2: _build_XOAuth2_token('loonbrieven@loonburo.be', token),
        host: 'outlook.office365.com',
        port: 993,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false,
          servername: 'outlook.office365.com',
        },
      });
      imap.once('ready', () => {
        log(`Open Imap Connection`);
        imap.openBox('INBOX', true, (err, box) => {
          if (err) throw err;
          if (box.messages.total === 0) {
            log('INBOX is empty, nothing to process');
            imap.end();
            return;
          }
          var f = imap.seq.fetch('1:*', {
            bodies: '',
            struct: true,
          });
          log(`Loop Inbox Mails`);
          f.on('message', function (msg, seqno) {
            let to, subject, attachments, ccAddresses, uid, parsed;
            let prefix = '(#' + seqno + ') ';
            let attributes;

            let parsedPromise = new Promise((resolve) => {
              msg.on('body', function (stream, info) {
                simpleParser(stream, (err, _parsed) => {
                  if (err) {
                    log(`${prefix} Parse error: ${err}`);
                    resolve();
                    return;
                  }
                  parsed = _parsed;
                  subject = parsed.subject;
                  to = parsed.to.value[0].address.toLowerCase();
                  attachments = parsed.attachments;
                  ccAddresses = parsed.cc ? parsed.cc.value.map(v => v.address.toLowerCase()) : [];
                  resolve();
                });
              });
            });

            let attributesPromise = new Promise((resolve) => {
              msg.once('attributes', function (attrs) {
                attributes = attrs;
                uid = attrs.uid;
                resolve();
              });
            });

            msg.once('end', async function () {
              await Promise.all([parsedPromise, attributesPromise]);

              if (!parsed || !uid) {
                log(`${prefix} Skipping message: missing parsed or uid`);
                return;
              }

              log(`${prefix} subject: ${subject}`);
              log(`${prefix} to: ${to}`);
              log(`${prefix} cc: ${ccAddresses.join(', ')}`);

              // Match against rules (subject + cc)
              const matchedRule = rules.find(rule =>
                attachments.length > 0 &&
                rule.subject_words.some(word => subject && subject.toUpperCase().includes(word.toUpperCase())) &&
                (!rule.cc || ccAddresses.includes(rule.cc.toLowerCase()))
              );

              if (matchedRule) {
                log(`${prefix} [${uid}] Matched rule: ${matchedRule.name}`);
                log(`${prefix} Has attachments: ${attachments.length}`);

                for (let i = 0; i < attachments.length; i++) {
                  let attachment = attachments[i];
                  let filename = attachment.filename;
                  log(`${prefix} filename: ${filename}`);

                  if (SKIP_IMAP_PROCESSING) {
                    log(`${prefix} [SKIP] SKIP_IMAP_PROCESSING=true, skipping file save and mail move`);
                  } else {
                    const yearSource = matchedRule.extract_year === 'subject' ? subject : filename;
                    const year = extractYear(yearSource, matchedRule.extract_year_regex);
                    const toBase64 = Buffer.from(to, 'utf-8').toString('base64');
                    const savePath = path.join(config.loonbrieven.path, toBase64, matchedRule.subfolder, year);

                    fs.mkdirSync(savePath, { recursive: true });

                    const filePath = getVersionedFilePath(savePath, filename, (msg) => log(`${prefix} ${msg}`));
                    log(`${prefix} filePath: ${filePath}`);
                    try {
                      fs.writeFileSync(filePath, attachment.content);
                      log(`${prefix} Attachment saved`);
                    } catch (err) {
                      console.error(err);
                    }

                    log(`${prefix} [${uid}] Move mail to processed`);
                    imap.move(uid, 'processed', function (err) {
                      if (err) log(err.toString());
                      else log(`${prefix} [${uid}] Mail moved`);
                    });
                  }
                }
              } else {
                log(`${prefix} [${uid}] No rule matched, moving to skipped`);
                imap.move(uid, 'skipped', function (err) {
                  if (err) log(err.toString());
                  else log(`${prefix} [${uid}] Mail moved to skipped`);
                });
              }
            });
          });
          f.once('error', function (err) {
            log('Fetch error: ' + err);
          });
          f.once('end', function () {
            log('Done fetching all messages!');
          });
        });
      });
      imap.once('error', err => {
        log(err.toString());
      });
      imap.once('end', () => {
        log('Imap Connection ended');
      });
      imap.once('close', () => {
        log('Imap Connection closed');
      });
      imap.connect();
      setTimeout(() => {
        imap.end();
        imap.destroy();
      }, 50 * 60 * 1000);
    } catch (err) {
      console.log(err);
    }
  }
};