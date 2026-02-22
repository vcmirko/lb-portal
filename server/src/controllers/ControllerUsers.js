import config from '../config.js';
import fs from 'fs'

export default {

  get: async (req, res) => {
      const dirs = fs.readdirSync(config.loonbrieven.path)
      const users = dirs.map((d) => {
        const files = fs.readdirSync(`${config.loonbrieven.path}/${d}`)
        var count = files.length
        var isRegistered = false
        const password = files.find(x => x=="password.yaml")
        if(password){
          isRegistered=true
          count--
        }
        return {
          email: Buffer.from(d,'base64').toString('utf-8'),
          count: count,
          isRegistered: isRegistered
        }

      })
      res.json({ users });
  },
  // getByEmail: async (req, res) => {
  //     const email = req.params.email;
  //     if (!email) return Response.NotFoundUser(res);
  //     const userPath = loonbrieven.getPath(email)
  //     if(userPath){
  //       const files = fs.readdirSync(userPath)
  //       const pdfs = files.filter(file => {
  //          return path.extname(file).toLowerCase() === '.pdf';
  //       })
  //       res.json({ pdfs });
  //     }else{
  //       return Response.NotFoundUser(res);
  //     }
  // },

};
