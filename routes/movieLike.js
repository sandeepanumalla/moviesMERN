const express = require('express');
const { MovieDislikes } = require('../models/MovieDislikes');
const {MovieLikes} = require('../models/MovieLikes')

const router = express.Router();


router.get('/getMovieLikes/:movieId',async (req,res)=>{
    try {
        MovieLikes.find({movieId:req.params.movieId}).exec((err,result)=>{
            if(err || !result || result.length == 0){
                return res.status(400).json("No users have liked this movie ")
            }
            return res.status(200).json(result)
        })   
    } catch (err) {
      return res.status("400").json("error in catch",err);   
    }
         
})

const duplicateChecker = async(req,res,next)=>{
    try{
        console.log("checking",req.params.userId)
        MovieLikes.findOne({userId: req.params.userId,
            movieId: req.params.movieId})
            .exec((err,success)=>{
                if(err || !success){
                    return next();
                }
                else{
                    console.log(success);
                    return res.status(400).json("This user has already liked this movie");
                }
            })
    }
    catch(err){
        return res.status(400).json("Error in catch, ",err);
    }
}

const ifDisLiked=(req,res,next)=>{
    const obj = {userId: req.params.userId,
        movieId: req.params.movieId}
        MovieDislikes.findOne(obj).exec((err,success)=>{
            if(success){
                MovieDislikes.findOneAndDelete(obj).exec((err,success)=>{
                    if(err || !success){
                        return res.status(400).json("error in disliking movie")
                    }
                    return next()
                })
                 
            }
            else{
                return next();
            }
        })
}

router.post('/addmovieLikes/:userId/:movieId',duplicateChecker,ifDisLiked,async(req,res)=>{
    try {
        
                const likes = new MovieLikes({
                    userId: req.params.userId,
                    movieId: req.params.movieId
                })
                console.log(req.params.userId,req.params.movieId);
                likes.save((err,success)=>{
                    if(err || !success){
                        console.log(":err",err);
                        return res.status(400).json("error saving the likes")
                    }
                    return res.status(200).json(success);
                })

    } catch (err) {
        return res.status(400).json("error in catch!! failed adding liked to movie " ,err);
    }
})

router.delete("/unLikeMovie/:userId/:movieId",async(req,res)=>{
    try{
        const obj = {userId: req.params.userId,
            movieId: req.params.movieId}
        MovieLikes.findOneAndDelete(obj).exec((err,success)=>{
            if(err || !success){
                console.log("err in deleting",err);
                return res.status(400).json("unable to unlike the movie")
            }
            return res.status(200).json("movie unliked successfully!");
        })
    }
    catch(err){
        return res.status(400).json("error in catch failed unliking movie !! " ,err);
    }
})

// router.post() 


module.exports = router;