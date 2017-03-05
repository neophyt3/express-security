'use strict';

function allowAnonymousAccess(req) {
  const url = req.originalUrl;
  // allow /login and /logout to be accessible for users without being authenticated
  return url.startsWith('/login') || url.startsWith('/logout');
}

function getCurrentUserName(req) {
  return req.session && req.session.user && req.session.user.username;
}

function getReturnUrl(req) {
  return encodeURIComponent(req.originalUrl || '');
}

module.exports = function authenticateRequest(req, res, next) {
  if (allowAnonymousAccess(req)) {
    return next();
  } else {
    let username = getCurrentUserName(req);
    if (!username) {
      // unauthenticated request
      const returnUrl = getReturnUrl(req);
      res.redirect(303, `/login/?returnUrl=${returnUrl}`);
    } else {
      // authenticated request, continue
      return next();
    }
  }
};