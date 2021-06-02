const mongoose = require('mongoose');

const movieDislikes = mongoose.Schema({
    userId:{
        type: String
    },
    movieId:{
        type:String
    }
})

const MovieDislikes = mongoose.model('movieDislikes',movieDislikes);

module.exports = {MovieDislikes};