import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    googleId:{
        type:String
    },
    username : {
        type : String,
        require : true
    },
    user_email : {
        type :String,
        require: true,
        unique : true
    },
    userImage:{
    type : String,
    require : true
    },
    userpassword :{
        type : String,
        require : true
    },
    created_At : {
        type : Date,
        default : Date.now
    }
})



const userModel = mongoose.model('users',userSchema);




export default userModel;