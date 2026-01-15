import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import ConnectDB from './config/DbConnect.js'
import ejs from 'ejs'
import userAuth from './middleware/auth.js'
import session from 'express-session';
import './middleware/googleAuth.js'
import passport from 'passport'
import rateLimit from 'express-rate-limit'



const limitter = rateLimit({
    windowMs : 1000*60,
    max:5,
    message:"too manny times entered, try later!!"
})



dotenv.config()
const app = express();

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false
}))


app.set('view engine','ejs')
ConnectDB();


app.use(passport.initialize());
app.use(passport.session())

//middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/',userRoutes)
app.use(limitter)
app.use('/login',userRoutes)







app.listen(process.env.PORT , ()=>{
    console.log(`server started at ${process.env.PORT}`);
    
})