import { body, validationResult } from 'express-validator';
import loonbrieven from '../helpers/helperLoonbrieven.js';
import jwt from '../helpers/helperJwt.js';
import Response from '../helpers/helperResponse.js';
import crypto from '../helpers/helperCrypto.js'

export default {
  validate: method => {
    if (method === 'login') {
      return [body('email', 'Invalid email').exists().isEmail(), body('password').exists()];
    } else if (method === 'register') {
      return [body('email', 'Invalid email').exists().isEmail()];
    } else if (method === 'verify') {
      return [body('email', 'Invalid email').exists().isEmail(), body('password').exists(),body('check').exists()];
    } else {
      return [];
    }
  },

  getCurrentUser: async (req, res) => {
    const email = req.payload;
    if (!email) return Response.NotFoundUser(res);
    res.json({ email });
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });
      const { email, password } = req.body;
      const folder = loonbrieven.getPath(email)
      if(!folder) return Response.NotFoundUser(res);
      const passwordCheck = loonbrieven.getPassword(email);
      if(!passwordCheck) return Response.NotRegisteredUser(res);
      var match = crypto.checkPassword(password,passwordCheck)
      if(!match) return Response.InvalidUserOrPass(res);
      const accessToken = await jwt.signAccessToken(email);

      return Response.Ok(res, { accessToken });
    } catch (error) {
      next(Response.InternalServerError(res, error.message));
    }
  },

  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });
      const { email } = req.body;
      const folder = loonbrieven.getPath(email)
      if(!folder) return Response.NotFoundUser(res);
      const password = loonbrieven.getPassword(email);
      if(password!="") return Response.AlreadyRegisteredUser(res)
      const passwordCheck = await loonbrieven.register(email,password);
      if(!passwordCheck) return Response.InternalServerError(res, 'Mail versturen mislukt')
      return Response.Ok(res);
    } catch (error) {
      next(error);
    }
  },
  lostPassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });
      const { email } = req.body;
      const folder = loonbrieven.getPath(email)
      if(!folder) return Response.NotFoundUser(res);
      const password = loonbrieven.getPassword(email);
      if(password=="") return Response.NotRegisteredUser(res)
      const passwordCheck = await loonbrieven.register(email,password);
      if(!passwordCheck) return Response.InternalServerError(res, 'Mail versturen mislukt')
      return Response.Ok(res);
    } catch (error) {
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return Response.BadRequest(res, { errors: errors.array() });
      const { email, password, check } = req.body;
      const folder = loonbrieven.getPath(email)
      if(!folder) return Response.NotFoundUser(res);
      const passwordChange = loonbrieven.changePassword(email,password,check);
      if(!passwordChange) return Response.BadCode(res);
      return Response.Ok(res);
    } catch (error) {
      next(error);
    }
  },

};
