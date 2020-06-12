module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET';
    req.query = req.body;
    next();
  } else {
    next();
  }
};
