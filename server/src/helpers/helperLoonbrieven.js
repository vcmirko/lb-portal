import config from '../config.js';
import fs from 'fs';
import Yaml from 'yaml';
import nodemailer from 'nodemailer';
import crypto from './helperCrypto.js';

const funcs = {


  getPath: (email) => {
    const toBase64=Buffer.from(email,'utf-8').toString('base64')
    // console.log(toBase64)
    const userPath = `${config.loonbrieven.path}/${toBase64}`
    // console.log(userPath)
    const folder = fs.existsSync(userPath)
    return folder?userPath:false
  },
  getPassword: (email) => {
    const folder = funcs.getPath(email)
    if(folder){
      const passwordPath = `${folder}/password.yaml`
      const passwordExists = fs.existsSync(passwordPath)
      if(passwordExists){
        const passwordFile = fs.readFileSync(passwordPath, 'utf8')
        const password = Yaml.parse(passwordFile)
        return password.password
      }else{
        return ""
      }
    }else{
      return ""
    }
  },
  register: async (email) => {
    const folder = funcs.getPath(email)
    if(folder){
      console.log("user exists")
      const passwordPath = `${folder}/password.yaml`
      const passwordExists = fs.existsSync(passwordPath)
      const check = Math.floor(100000 + Math.random() * 900000);

      var passwordObj = {
        password: "",
        check: check
      }
      if(!passwordExists){
        console.log('making password.yaml')
        fs.writeFileSync(passwordPath,Yaml.stringify(passwordObj))
        console.log("File created")
      }else{
        console.log('changing password.yaml')
        const passwordFile = fs.readFileSync(passwordPath,'utf8')
        passwordObj = Yaml.parse(passwordFile)
        passwordObj.check = check
        fs.writeFileSync(passwordPath,Yaml.stringify(passwordObj))
      }
      let transporter = nodemailer.createTransport(config.mail.transport)
      try {
          await transporter.sendMail({
            from: `"Loonburo.be" <${config.mail.from}>`,
            to: email,
            subject: "Uw account bij loonburo.be",
            text: "Hieronder vindt u uw code voor het resetten van uw wachtwoord.\r\nUw Code : " + check + "\r\n\r\nMvg,\r\nLoonburo",
            html: "Hieronder vindt u uw code voor het resetten van uw wachtwoord.<br>Uw Code : <b>" + check + "</b><br><br>Mvg,<br>Loonburo",
          });
          console.log("Code mail sent to " + email)
        } catch(mailErr) {
          console.error("Mail send failed:", mailErr.message, "| code:", mailErr.code, "| command:", mailErr.command, "| response:", mailErr.response)
          return false
        }
      return check
    }else{
      return false
    }
  },
  changePassword: (email,password,check) => {
    const folder = funcs.getPath(email)
    console.log(email)
    console.log(password)
    console.log(folder)
    if(folder){
      console.log("user exists")
      const passwordPath = `${folder}/password.yaml`
      const passwordExists = fs.existsSync(passwordPath)
      if(!passwordExists){
        return false
      }else{
        console.log('changing password.yaml')
        const passwordFile = fs.readFileSync(passwordPath,'utf8')
        var passwordObj = Yaml.parse(passwordFile)
        if(passwordObj.check == check){
          passwordObj.password=crypto.hashPassword(password)
          passwordObj.check=""
          fs.writeFileSync(passwordPath,Yaml.stringify(passwordObj))
          return true
        }else{
          return false
        }
      }
    }else{
      return false
    }
  },
}

export default funcs
