const express = require('express');
const user = require('./router/user')
const product = require('./router/product')
const order = require('./router/order')
const cart = require('./router/carts');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs');

app.use(cors())
app.listen(4000, () => {
    console.log("listen port 4000");
})

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {

    let text = new Date().toGMTString() + "  : " + req.url + '\n';
    fs.appendFile("log.txt", text, () => {
        next();
    })
})
app.get('/api', (req, res) => {
    res.send("hello world");
})

app.get('/api/person', (req, res) => {
    res.send("hello world person");
})

// app.use("/student", student);

app.use("/api/product", product);
app.use("/api/order", order);
app.use("/api/user", user);
app.use("/api/cart", cart);


app.use((req, res, next) => {

    let text = new Date().toGMTString() + "  : " + req.url + '\n';
    fs.readFile("404.html", 'utf-8', (err, data) => {
        res.status(404).send(data);
    })
})
