const cors = require('cors');
const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const { errorHandling } = require('./src/middelwares/errorHandling');
const routes = require('./src/routes/routes.js');

const app = express();
const PORT = process.env.PORT || 2142;

app.use(cors());

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);
app.use(errorHandling);

app.listen(PORT, () => {
   console.log(`Server on port ${PORT}`);
});