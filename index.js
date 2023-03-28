const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

const errorController = require('./controllers/error');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.all("*",  (req, res, next) => {
  res.render("404", { title: "Page Not Found" });
});


app.get('/', (req, res) => {
    res.send('Home Page Route');
});

app.get('/about', (req, res) => {
    res.send('About Page Route');
});

app.get('/portfolio', (req, res) => {
    res.send('Portfolio Page Route');
});

app.get('/contact', (req, res) => {
    res.send('Contact Page Route');
});

app.listen(PORT, () => {
    console.log(`Express Server running on http://localhost:${PORT}`)
})
