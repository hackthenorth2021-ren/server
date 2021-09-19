const { HttpError } = require('../utils/error');
const fbAdmin = require('firebase-admin');
const fbConfig = require('../../config/fbconfig.json');

fbAdmin.initializeApp({ credential: fbAdmin.credential.cert(fbConfig)} );

async function auth(req, _res, next) {
  let isAuth = false;
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const result = await fbAdmin.auth().verifyIdToken(token);
      if (result.email) {
        req.query.user = result.email;
        isAuth = true;
      }
    } catch { }
  }
  // if (!isAuth) {
  //   return next(new HttpError(403, 'Unauthorized'));
  // } else {
    next();
  // }
}

module.exports = auth;