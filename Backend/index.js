//required imports

require('dotenv').config({path: __dirname + '/.env'})
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser')
const bcryptjs = require('bcryptjs')
const expressSession = require('express-session')
const User = require('./model/User')
const {responses, messages} = require('./config/responses')
const app = express()


// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}))

app.use(expressSession({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false
}))

app.use(cookieParser('1234'))
app.use(passport.initialize())
app.use(passport.session())
require('./config/auth')(passport)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(404).send({"response": responses.FAILED, "message": messages.NO_LOGIN})
}

// end middleware


// mongoDB connect
mongoose.connect(process.env.connection_string,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {
        console.log('MongoDB Atlas connected')
    })

const userLogger = (req, res, next)=>{
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            res.send({"response": responses.FAILED, "message": JSON.stringify(error)})
        } else if (user) {
            req.logIn(user, error => {
                if (error) {
                    throw error
                } else {
                    res.send({"response": responses.SUCCESS, "message": messages.LOGIN_SUCCESS})
                }
            })
        } else {
            res.send({"response": responses.SUCCESS, "message": messages.NO_USER})
        }
    })(req, res, next)
}

// routes
app.post('/login', (req, res, next) => {
    userLogger(req,res,next)
})

app.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username}, (error, doc) => {
        if (error) {
            res.status(400).send(error)
            res.end()
        }
        if (doc) {
            res.status(406).send({"response": responses.FAILED, "message": messages.USER_EXISTS})
            res.end()
        } else {
            let password = bcryptjs.hashSync(req.body.password, 10)
            new User({
                username: req.body.username,
                password: password
            }).save((error) => {
                if (error) {
                    res.status(400).send({"response": responses.FAILED, "message": error.message})
                    res.end()
                }else{
                    userLogger(req,res,next)
                    // res.status(200).send({"response": responses.SUCCESS, "message": messages.USER_CREATED})
                    // res.end()
                }
            })
        }
    })
})

app.get('/getUser', isLoggedIn, (req, res) => {
    res.send(req.user)
})

app.get('/getData', isLoggedIn, (req, res) => {
    User.findOne({_id: req.user._id}, (error, doc) => {
        if (error) {
            res.send({"response": responses.FAILED, "message": JSON.stringify(error)})
        } else {
            res.send({"response": responses.SUCCESS, "message": doc.favPokemon})
        }
    })
})

app.post('/addList', isLoggedIn, (req, res) => {
    function containsObject(obj, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }

    if (req.user._id) {
        User.findOne({username: req.user.username}, (error, doc) => {
            if (error) {
            } else if (doc) {
                if (req.body.flag) {
                    if (!containsObject(req.body.id, doc.favPokemon)) {
                        doc.favPokemon.push(req.body.id)
                        doc.save()
                    }
                } else {
                    if (containsObject(req.body.id, doc.favPokemon)) {
                        doc.favPokemon = doc.favPokemon.filter(el => el !== req.body.id)
                        doc.save()
                    }
                }
                res.send({"response": responses.SUCCESS, "message": ""})
            } else {
                res.send({"response": responses.FAILED, "message": ""})
            }
        })
    } else {
        res.send({"response": responses.FAILED, "message": messages.NO_LOGIN})
    }

})

app.get('/logout', (req, res) => {
    req.logout()
    req.session = null
    res.clearCookie('connect.sid')
    res.send({"response": responses.SUCCESS, "message": messages.LOGOUT_SUCCESS})

})

app.listen(5001)