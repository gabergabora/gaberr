const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const methodOverride = require("method-override");
/*
const rateLimit = require('express-rate-limit');


const Message = require('./models/message');
const notify = require('./controllers/notify');
const format = require('./controllers/format');
*/

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'assets')))


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))
/*
const contactLimiter = rateLimit({
    windowMs: 60000,
    max: 1,
    message: 'To discourage spam, there is a message cooldown of 1 minute.',
    skipFailedRequests: true,
    requestWasSuccessful: function (req, res) {
        const { contactStatus } = req.signedCookies;
        return contactStatus !== 'error' || contactStatus !== 'invalid';
    },
    handler: function (req, res) {
        res.cookie('rateLimited', 'true', { signed: true, secure: true, httpOnly: true, maxAge: 60000 });
        res.redirect('/contact');
    }
});

function getIP(req) {
    return req.headers['x-real-ip'] || req.socket.remoteAddress;
}

app.post('/contact', contactLimiter, async function (req, res) {
    try {
        if (!format.check(req.body)) {
            res.cookie('contactStatus', 'invalid', { signed: true, secure: true, httpOnly: true, maxAge: 60000 });
            return res.redirect('/contact');
        }

        for (let key in req.body) {
            req.body[key] = format.sanitize(req.body[key]);
        }

        const { name, email, body, token } = req.body;

        const recaptcha = await axios.post('https://www.google.com/recaptcha/api/siteverify', `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${getIP(req)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const success = recaptcha.data.success;
        const score = recaptcha.data.score;

        if (!success || score < 0.5) {
            res.cookie('contactStatus', 'recaptchaFailed', { signed: true, secure: true, httpOnly: true, maxAge: 60000 });
            return res.redirect('/contact');
        }

        let newMessage = new Message({ name: name, email: email, body: body, meta: { ip: getIP(req), date: new Date(), recaptcha: { success: success, score: score } } });
        await newMessage.save();

        notify.message(name, email, body, getIP(req));
        res.cookie('contactStatus', 'success', { signed: true, secure: true, httpOnly: true, maxAge: 60000 });
        res.redirect('/contact');
    } catch (err) {
        console.log(err);
        notify.alert(err, getIP(req)).catch();
        res.cookie('contactStatus', 'error', { signed: true, secure: true, httpOnly: true, maxAge: 60000 });
        res.redirect('/contact');
    }
});

app.get('/contact', function (req, res) {
    const { contactStatus = null, rateLimited = false } = req.signedCookies;

    if (!contactStatus && !rateLimited) {
        res.status(400);
        res.redirect('/');
    } else {
        if (rateLimited === 'true') {
            res.clearCookie('rateLimited', { signed: true, secure: true, httpOnly: true });
            res.status(429);
            res.render('status', { status: '429', title: 'Error' });
        } else {
            if (contactStatus === 'error') {
                res.status(500);
            }
            res.render('status', { status: contactStatus, title: 'Contact' });
        }
    }
});*/

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

app.all("*",  (req, res, next) => {
  res.render("404", { title: "Page Not Found" });
});

app.use(function (req, res) {
    res.status(404);
    res.render('404', { status: '404', title: 'Error' });
});

app.use(function (err, req, res, next) {
    console.log(err);
 //   notify.alert(err, getIP(req)).catch();
    res.status(500);
    res.render('404', { status: '500', title: 'Error' });
});

app.listen(PORT, () => {
    console.log(`Express Server running on http://localhost:${PORT}`)
})
