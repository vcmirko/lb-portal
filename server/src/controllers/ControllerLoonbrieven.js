import Response from '../helpers/helperResponse.js';
import loonbrieven from '../helpers/helperLoonbrieven.js';
import config from '../config.js';
import fs from 'fs'
import path from 'path'

export default {

  get: async (req, res) => {
    const email = req.payload;
    if (!email) return Response.NotFoundUser(res);
    const userPath = loonbrieven.getPath(email)
    if (!userPath) return Response.NotFoundUser(res);

    const visualization = config.loonbrieven.visualization;
    const sections = [];

    for (const viz of visualization) {
      const subfolderPath = path.join(userPath, viz.subfolder);
      const years = {};

      if (fs.existsSync(subfolderPath)) {
        const yearDirs = fs.readdirSync(subfolderPath).filter(entry => {
          return fs.statSync(path.join(subfolderPath, entry)).isDirectory() && /^\d{4}$/.test(entry);
        });
        for (const year of yearDirs) {
          const yearPath = path.join(subfolderPath, year);
          const pdfs = fs.readdirSync(yearPath).filter(f => path.extname(f).toLowerCase() === '.pdf');
          if (pdfs.length > 0) years[year] = pdfs;
        }
      }

      sections.push({ subfolder: viz.subfolder, title: viz.title, years });
    }

    res.json({ sections });
  },

  getByName: async (req, res) => {
    const email = req.payload;
    const { subfolder, year, filename } = req.params;
    if (!filename.match(/\.pdf$/g)) return Response.InvalidParams(res);
    if (!email) return Response.NotFoundUser(res);
    const userPath = loonbrieven.getPath(email);
    if (!userPath) return Response.NotFoundUser(res);

    const filePath = path.join(userPath, subfolder, year, filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      return Response.NotFound(res);
    }
  },
};
