const express = require('express');
const { MovieDislikes } = require('../models/MovieDislikes');
const { MovieLikes } = require('../models/MovieLikes');


const router = express.Router();


router.get('/getMovieDislikes/:movieId',async (req,res)=>{
    try {
        MovieDislikes.find({movieId:req.params.movieId}).exec((err,result)=>{
            // console.log(result.length);
            if(err || !result || result.length == 0){
                return res.status(400).json("No users have disliked this movie ")
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
        MovieDislikes.findOne({userId: req.params.userId,
            movieId: req.params.movieId})
            .exec((err,success)=>{
                if(err || !success){
                    return next();
                }
                else{
                    console.log(success);
                    return res.status(400).json("This user has already disliked this movie");
                }
            })
    }
    catch(err){
        return res.status(400).json("Error in catch, ",err);
    }
} 

const ifLiked=(req,res,next)=>{
    const obj = {userId: req.params.userId,
        movieId: req.params.movieId}
    MovieLikes.findOne(obj).exec((err,success)=>{
            if(success){
                MovieLikes.findOneAndDelete(obj).exec((err,success)=>{
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


router.post('/addMovieDislikes/:userId/:movieId',duplicateChecker,ifLiked,async(req,res)=>{
    try {
                const likes = new MovieDislikes({
                    userId: req.params.userId,
                    movieId: req.params.movieId
                })
                console.log(req.params.userId,req.params.movieId);
                likes.save((err,success)=>{
                    if(err || !success){
                        console.log(":err",err);
                        return res.status(400).json("error saving the dislikes")
                    }
                    return res.status(200).json(success);
                })

    } catch (err) {
        return res.status(400).json("error in catch!! " ,err);
    }
})


router.delete("/unDisLikeMovie/:userId/:movieId",async(req,res)=>{
    try{
        const obj = {userId: req.params.userId,
            movieId: req.params.movieId}
        MovieDislikes.findOneAndDelete(obj).exec((err,success)=>{
            if(err || !success){
                console.log("err in deleting",err);
                return res.status(400).json("unable to un dislike the movie")
            }
            return res.status(200).json("movie un disliked successfully!");
        })
    }
    catch(err){
        return res.status(400).json("error in catch failed un disliking movie !! " ,err);
    }
})

// router.post()


module.exports = router;