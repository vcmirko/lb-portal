"use strict";
import { fileURLToPath } from 'url';
import app from './app.js';
import path from 'path';
import Greenlock from "greenlock-express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`======> ${process.env.NODE_ENV}`)
if(process.env.NODE_ENV=="development"){
  app.listen(3001, () => {
    console.log(`Start server, port: 3001`);
  });
}else{
  var configDir = path.join(__dirname,"./../greenlock.d")
  console.log(`greenlock config => ${configDir}`)
  Greenlock.init({
      packageRoot: "./",
      configDir: configDir,

      // contact for security and critical bug notices
      maintainerEmail: "mirko@vancolen.com",

      // whether or not to run at cloudscale
      cluster: false
  })
  // Serves on 80 and 443
  // Get's SSL certificates magically!
  .serve(app);
}
