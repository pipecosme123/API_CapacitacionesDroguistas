const fs = require('fs');

exports.downloadexcel = (req, res, next) =>{

   const { filename } = req.body;

   fs.rmSync(filename);

}