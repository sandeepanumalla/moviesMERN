const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { response } = require('express');
require('dotenv').config()
const cors = require('cors')

const bcrypt = require('bcryptjs');


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Authentication failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id, name: user.name,email:user.email, image: user.image
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});
let transporter =  nodemailer.createTransport({
    service: "gmail",
   // true for 465, false for other ports
    auth: {
      user: `${process.env.GMAIL}`, // generated ethereal user
      pass: `${process.env.PASSWORD}`, // generated ethereal password
    },
  });
  
router.post("/reset-password",async (req,res)=>{
    const JWT_SECRET  = process.env.SECRET;
    try{
        
            console.log("email",process.env.GMAIL);
        if(req.body.email.trim().length > 0){

            await User.findOne({email:req.body.email},(err,document)=>{
                if(err || !document){
                    return res.status(400).json("user does not exist")
                }
                const secret = JWT_SECRET + document.password;
                const payload = {
                    email:document.email,
                    id:document._id
                }
                const token = jwt.sign(payload,secret,{expiresIn:'15m'});
                
                const resetLink = `https://yosank.herokuapp.com/change-password/${document._id}/${token}`
                  // send mail with defined transport object
                  let info =  transporter.sendMail({
                    from: `${process.env.GMAIL}`, // sender address
                    to: document.email, // list of receivers
                    subject: "Yosank Security", // Subject line
                    text:`hello ${document.name},  
                     the password reset link is ${resetLink}
                    ` , // plain text body
                    html: `<b>hello ${document.name}, 
                    <br>
                    <p>the password reset link is <a href=${resetLink}>${resetLink}</a></p>`, // html body
                  }).then(response => console.log(response)).catch(err=>console.log("err occurred",err))
                
                  console.log("Message sent: %s", info);
                return res.status(200).json(`Mail has been sent please follow the instructions`);
            })
        }
        else{
            return res.status(400).json("please provide email")
        }
    }
    catch(err){
        console.log("error in routes catch!!",err);
    }
})

router.get(`/reset-password/:userId/:token`,async(req, res)=>{
    const JWT_SECRET  = process.env.SECRET;
    try{
        const {userId,token} = req.params;
       await User.findById(userId,(err,user)=>{
            if(err || !user){
                return res.status(400).json("Invalid id")
            }            
            try{
                const secret = JWT_SECRET + user.password;
                const payload = jwt.verify(token, secret);
                return res.status(200).json("valid !!")
            }
            catch(err){
                return res.status(400).json("catch in verifying the token"+err.message);
            } 

        })
    }
    catch(err){
        console.log("error in catch"+err);
    }
})


router.post(`/reset-password1/:userId/:token`,async (req,res)=>{
    const JWT_SECRET = process.env.SECRET;
    const {password, confirmPassword} = req.body;
    const salt =  await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt)
    try{
        const {userId,token} = req.params; 
        await User.findById(userId,(err,user)=>{
            if(err || !user){
                return res.status(400).json("Invalid id")
            }
            try{
                console.log("user pass",user);
                const secret = JWT_SECRET + user.password;
                const payload = jwt.verify(token, secret);
                
                if(password == confirmPassword){
                   
                     console.log(salt);
                        
                    User.findOneAndUpdate({_id:userId},{$set:{"password":newPassword}},(err,success)=>{
                        if(err || !success){
                            return res.status(400).json("error in updating password")
                        }
                        return res.status(200).json("successfully resetted the password");
                    })
                }
                else{
                    return res.json("passwords dont match");
                }
                
 
            }
            catch(err){
                return res.json("catch  in updating password"+err.message);
            } 
        })
    }
    catch(err){

    }
    

})

module.exports = router;
