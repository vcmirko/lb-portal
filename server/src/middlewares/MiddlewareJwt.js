import jwt from '../helpers/helperJwt.js';
import loonbrieven from '../helpers/helperLoonbrieven.js';
import Response from '../helpers/helperResponse.js';

export default {
  verifyAccessToken: async (req, res, next) => {
    const authHeader = req.headers?.['authorization'] || '';
    if (!authHeader) return next(Response.Unauthorized(res));
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const email = await jwt.verifyAccessToken(token);
    if (email) {
      const folder = loonbrieven.getPath(email)
      if (!folder) return Response.NotFoundUser(res);
      req.payload = email;
      return next();
    } else {
      return next(Response.Unauthorized(res));
    }
  },
  verifyAdminToken: async (req, res, next) => {
    const authHeader = req.headers?.['authorization'] || '';
    if (!authHeader) return next(Response.Unauthorized(res));
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const email = await jwt.verifyAccessToken(token);
    if (email && email == 'loonbrieven@loonburo.be') {
      const folder = loonbrieven.getPath(email)
      if (!folder) return Response.NotFoundUser(res);
      req.payload = email;
      return next();
    } else {
      return next(Response.Unauthorized(res));
    }
  },
};
