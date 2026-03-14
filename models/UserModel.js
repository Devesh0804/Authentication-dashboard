import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
import { type } from "os";



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
    public_id :{
   type:String
    },
    created_At : {
        type : Date,
        default : Date.now
    }
})


userSchema.plugin(mongoosePaginate)
const userModel = mongoose.model('users',userSchema);




export default userModel;