const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const tokenRaw = req.header('Authorisation');
  if (!tokenRaw) return res.status(401).send('Access denied');
  const token = tokenRaw.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};
