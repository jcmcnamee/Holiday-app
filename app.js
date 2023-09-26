'use strict';

import express from 'express';
import bodyParser from 'body-parser';
// import axios from "axios";
import morgan from 'morgan';
import * as controllers from './controllers.js';
// import { isoToCountry, submitDest } from "./utils.js";

// Server config
const app = express();
const port = 3000;

// Variables
const weatherKey = 'c1f24b47cc67a5bbe94b01de82d9c931';

// Middleware
app.use(express.static('public'));
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.post('/submit', controllers.submitDest);
app.post('/submit/chooseCountry', controllers.chooseDest);
app.get('/getResults');

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
