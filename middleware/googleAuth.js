import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'
import dotenv from 'dotenv'
import userModel from "../models/UserModel.js";
import mongoose from "mongoose";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL

},async function(accessToken,refreshToken,profile,cb){
   try {
     let user = await userModel.findOne({googleId:profile.id})
     if(!user){
        user = await userModel.create({
            googleId:profile.id,
            user_email:profile.emails[0].value,
            userImage : profile.photos[0].value
        })
     }
     cb(null,user)
   } catch (error) {
     
   }

   
}
));

passport.serializeUser(function(user,done){
    done(null,user)
})

passport.deserializeUser(function(user,done){
    done(null,user)
})