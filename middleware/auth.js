import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const userAuth = (req,res,next)=>{
    try{

        let token = req.session.jwt
        if(!token) res.redirect('/')

        let value = jwt.verify(token,process.env.SECRET_KEY);
     
        
        req.user = value;
        next();

    
    }catch(err){

    }
}

export default userAuth;