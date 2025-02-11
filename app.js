const express = require('express');
const path = require('path')
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.static(path.join(`${__dirname}`)));
app.use(express.static("public"));

app.get('/', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/form.html`))
})

app.get('/view', (req, res) => {
    console.log("Request at " + req.url)
    res.sendFile(path.join(`${__dirname}/admin.html`))
})


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`)
})