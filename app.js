'use strict';

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import morgan from "morgan";
import { returnLocations } from "./utils.js";

// Server config
const app = express();
const port = 3000;

// Variables
const weatherKey = "";

// Middleware
app.use(express.static("public"));
app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) =>{
    res.render('index.ejs')
})

app.post("/submit", async (req, res) => {
    const dest = req.body.dest;

    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${dest}&limit=5&appid=${weatherKey}`)
        // res.render('index.ejs', {content: JSON.stringify(response.data)});
        const result = returnLocations(response.data);
        console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
})