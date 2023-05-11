exports.getDataAuth = (req, res, next) => {

   const base64Credentials = req.headers.authorization.split(' ')[1];
   const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
   const [username, password] = credentials.split(':');

   req.body = { correo: username, password };
   next();
}