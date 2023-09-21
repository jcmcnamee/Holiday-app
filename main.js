'use strict';

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import morgan from "morgan";

// Server config
const app = express();
const port = 3000;

// Variables
const weatherKey = "7b9892b86cf7be15ae7b9085bd8036f8";

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
        res.render('index.ejs', {content: JSON.stringify(response.data)});
    } catch (error) {
        console.log(error);
    }

    res.render('index.ejs', )


    

})

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
})