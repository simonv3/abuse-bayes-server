module.exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

module.exports.apiRequiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.json({ error: 'You need to be authenticated to access this endpoint.' });
  }
};
