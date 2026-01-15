import express from 'express'
import userModel from '../models/UserModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userAuth from '../middleware/auth.js';
import passport from 'passport';
import '../middleware/googleAuth.js'

const router = express.Router();








router.get('/',(req,res)=>{
    res.render('signup',{message : null})
})

router.post('/signup',async(req,res)=>{
    try {
       const {username , user_email , userpassword} = req.body;
       if(username && user_email && userpassword){

       let existData = await userModel.findOne({$or : [{username} , {user_email}]})
       if(existData) res.render('signup',{message : "User already exist !!"})

       let newPassword =await bcrypt.hash(userpassword,10);

       let data = new userModel({username,user_email,userpassword:newPassword})
       await data.save();

       res.redirect('/login')
}
else{
    res.render('signup',({message:"Enter the above details"}))
}
        
    } catch (error) {
        res.send(error)
    }
})



router.get('/login',(req,res)=>{
    res.render('login',{message : null})
})

router.post('/login',async(req,res)=>{
    try{
    const {user_email,userpassword} = req.body;

    let user = await userModel.findOne({user_email});
    if(!user) return res.render('login',({message:"user not found"}))
        
   
    let password = await bcrypt.compare(userpassword,user.userpassword);
    if(!password)  return res.render('login',({message : "Incorrect Password"}))
 
   if(user_email && userpassword){
    

    let token = jwt.sign(
        {_id : user._id , username : user.username},
        process.env.SECRET_KEY,
       {expiresIn:"1h"}

    )

req.session.jwt = token;
return res.redirect('/home')
    }
    else{
        res.render('login',({message : "Enter the above details !!"}))
    }
}catch(err){
    res.send(err)
}
    
})




//GOOGLE AUTH
router.get('/auth/google',
    passport.authenticate("google",{scope : ['profile','email'], prompt : 'select_account'})
     
    
)

router.get('/auth/google/callback', passport.authenticate("google",{ failureRedirect:'/login'}),(req,res)=>{
    console.log(req.user);
    let token = jwt.sign({username:req.user.username},
        process.env.SECRET_KEY ,
        {expiresIn:"1h"}


    )
    req.session.jwt = token;
    res.redirect('/home')
    
}
)



router.get('/home',userAuth, (req,res)=>{
    try {
        res.render('main')
    } catch (error) {
        res.send(err)
    }
})











export default router;