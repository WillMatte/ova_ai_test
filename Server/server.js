const express = require('express');
const cors = require('cors')
const bodyPaser = require('body-parser')
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const mongo_url = "mongodb://127.0.0.1:27017/test_ova"


const productRoutes = require("./Routes/productRoutes");
const dbRoutes = require("./Routes/dbRoutes");
const productListRoutes = require('./Routes/productListRoutes');

const ProductList = require('./Models/productList')

app.get('/',async (req, res) => {
    const productList = new ProductList();
    await productList.save();
    res.send('Hello World!');
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, DELETE'
    );
    next();
});
app.use(cors());
app.use(bodyPaser.json());
app.use(productRoutes);
app.use(dbRoutes);
app.use(productListRoutes);

app.use((error, req, res, next) => {
    console.log("Error : ", error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log('Node.js is listening on port %s ', port);
        });
    })
    .catch((err) =>{
        console.log(err)
    });