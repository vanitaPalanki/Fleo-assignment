const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const categoryRoute = require('./routers/routes');
const  app = express();

app.use(bodyParser.json());

app.use('/api/user', categoryRoute);

mongoose
    .connect('mongodb+srv://palankivanita:Palankivanita5@cluster0.hriqb.mongodb.net/category?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
        console.log('sucessfull');
    })
    .catch(err => {
        console.log(err);
    });