import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Yaml from 'yaml';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === 'development'
  ? path.resolve(__dirname, '../.env.development')
  : path.resolve(__dirname, '../.env');

dotenv.config({ path: envFile });

const rulesFile = path.resolve(__dirname, '../rules.yaml');
const rulesConfig = Yaml.parse(fs.readFileSync(rulesFile, 'utf8'));

export default {
  azure_app: {
    clientId: process.env.AZURE_APP_CLIENT_ID,
    authority: process.env.AZURE_APP_AUTHORITY,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  },
  server: {
    host: process.env.HOST || '',
    port: process.env.PORT || 80,
    prefix: '/api/v1',
  },
  token: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET || 'access-secret',
      expiresIn: process.env.ACCESS_TOKEN_LIFE || 60 * 60 * 24,
    }
  },
  loonbrieven: {
    path: "./loonbrieven",
    rules: rulesConfig.rules,
    visualization: rulesConfig.visualization,
  },
  imap: {
    host: 'outlook.office365.com',
    port: 993,
    tls: true,
    authTimeout: 25000,
    connTimeout: 30000,
    debug: console.log,
    tlsOptions: {
      rejectUnauthorized: false,
      servername: 'outlook.office365.com'
    }    
  },
  mail: {
    from: "no_reply@loonburo.be",
    transport:{
      host: "loonburo-be.mail.protection.outlook.com",
      port: 25,
      secure: false
    }
  }
};
