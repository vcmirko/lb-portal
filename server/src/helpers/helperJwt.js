import jwt from 'jsonwebtoken';
import config from '../config.js';


export default {
  signAccessToken: async (email) => {
    return await jwt.sign({ email: email }, config.token.access.secret, { expiresIn: config.token.access.expiresIn });
  },

  verifyAccessToken: async token => {
    var user
    try{
      user = await jwt.verify(token, config.token.access.secret);
    }catch(err){
      console.log(err.message)
    }
    return user?user.email:false;
  },
};
