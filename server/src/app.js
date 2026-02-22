import express from 'express';
import config from './config.js'; // <-- note the './'
import router from './routes/index.js';
import path from 'path';
import compression from 'compression';
import controllerImap from './controllers/ControllerImap.js';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors())

async function start() {
  try {
    app.use(compression())
    app.use(config.server.prefix, router);
    //Configure session middleware
    app.use(express.static(path.join(__dirname, 'public'))); // using build as root for create-react app
    // Set route for React build
    app.get('/*path', function (req, res) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    // disable to work with greenlock
    // app.listen(config.server.port, () => {
    //   console.log(`Start server, port: ${config.server.port}`);
    // });
    controllerImap.import()
    setInterval(()=>{
      controllerImap.import()
    },3600*1000)
  } catch (error) {
    console.log(error);
  }
}

start();
export default app;
