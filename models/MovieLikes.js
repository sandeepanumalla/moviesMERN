const mongoose = require('mongoose');

const movieLikes = mongoose.Schema({
    userId:{
        type: String
    },
    movieId:{
        type:String
    }
})

const MovieLikes = mongoose.model('movieLikes',movieLikes);

module.exports = {MovieLikes};