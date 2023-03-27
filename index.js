const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require(__dirname + '/routes/crudDataModulo.js');
// const routesInsert = require(__dirname + '/routers/insertData.js');

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(express.urlencoded({
   extended: false
}));
app.use(express.json());

app.use(routes);
// app.use(routesInsert);

app.listen(2142, () => {
   console.log('Server on port 2142');
});