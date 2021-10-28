//mongoDB  user model

const mongoose = require('mongoose')
const UserModel = new mongoose.Schema({
    username: String,
    password: String,
    favPokemon: []
})
module.exports = mongoose.model('User', UserModel);