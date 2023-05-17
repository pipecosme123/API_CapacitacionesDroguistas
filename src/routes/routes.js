const express = require('express');
const { get_data } = require('../controller/query');
const { excel } = require('../middelwares/excel');

const app = express();

app.get('/downloadExcel', get_data, excel);

module.exports = app;