var jsonServer = require('json-server');
var server = jsonServer.create();

var router = jsonServer.router(require('./db.js')());
var middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
// Add custom middleware before JSON Server router
// Add custom middleware before JSON Server router
server.use((req, res, next) => {
  console.log('*****************************************');
  console.log('Time:', Date.now());
  console.log('*****************************************');
  next();
});
server.listen(3000, function () {
  console.log('JSON Server is running at : http://localhost:3000/');
});
