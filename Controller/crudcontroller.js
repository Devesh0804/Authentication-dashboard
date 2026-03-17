import { fstat } from "fs";
// import StudentModel from "../models/dbConfig.js";
import StudentModel from "../models/UserModel.js";
import cloudinary from "../config/Cloudinaryconfig.js";
import path from 'path'
import fs from 'fs'


export const getData = async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        }
        
        let data = await StudentModel.paginate({}, options);
        // console.log(data);
        res.render('show', {
            Data: data.docs,
            totalDocs: data.totalDocs,
            limit: data.limit,
            totalPages: data.totalPages,
            page: data.page,
            pagingCounter: data.pagingCounter,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevPage: data.prevPage,
            nextPage: data.nextPage,


        })

        // res.send('hello')

    }
    catch (error) {
        console.log(error);

    }


}


export const getViewData = async (req, res) => {

    try {
        let data = await StudentModel.findById(req.params.id)
        
        console.log(data);
        
        if (!data) {
            res.render('page404', { message: 'id not found' })
        } else {
            res.render('read', { data })
        }
    }
    catch (error) {

    }
}
export const getinsertData = (req, res) => {
    res.render('insert')
}

export const insertData = async (req, res) => {
    try {
        
        let student = await StudentModel(req.body)
        //  student._id = req.body._id
        if (req.file) {
          let imageResult =  await  cloudinary.uploader.upload(req.file.path , {
                folder :"user Image"
            })
            let image = imageResult.url;
            let public_id = imageResult.public_id;
          
            student.userImage = image;
            student.public_id = public_id;
            if(req.file && fs.existsSync(req.file.path)){
                fs.unlinkSync(req.file.path);
            }
            
        }

        let newstudent = await student.save();


       res.redirect('/crudRoutes/read')   


    } catch (error) {
        console.log(error);

    }
}

export const getUpdateData = async (req, res) => {

    let data = await StudentModel.findOne({ _id: req.params.id })
  
    // console.log(data);
   
    res.render('update', { data })
}

export const updateData = async (req, res) => {

    try {

        // if (req.file) {
        //     await StudentModel.updateOne({ _id: req.params.id }, { $set: { userImage: req.file.filename } })
        //     res.redirect('/crudRoutes/read')
        // }
        // else {
        //     console.log(req.body)
        //  let data =  await StudentModel.updateOne({ _id: req.params.id }, { $set: req.body } , {new : true})
        //  console.log(data);
        //    
        // }

       const {username , user_email} = req.body;
       let user = await StudentModel.findById(req.params.id);
       let userImage = user.userImage;
       let ImageID = user.public_id;
      
       if(req.file){
        if(ImageID){
          await cloudinary.uploader.destroy(ImageID);
        }
        let UpdatedImage  =  await cloudinary.uploader.upload(req.file.path,{
                folder :"user Image"
            })
            console.log(UpdatedImage);
    
        let imageUrl = UpdatedImage.url;
        let public_id = UpdatedImage.public_id;
        if(UpdatedImage){
            userImage = imageUrl;
            ImageID = public_id
        }
        else{
            userImage = user.userImage;
            ImageID  = user.public_id;
        }
       }
       if(req.file.path && fs.existsSync(req.file.path)){
       fs.unlinkSync(req.file.path)
       }
      await StudentModel.findByIdAndUpdate({_id : req.params.id} , {$set:
        {username : username ,
         user_email : user_email, 
         userImage : userImage ,
          public_id : ImageID }} , {new : true});
  
           res.redirect('/crudRoutes/read')

    } catch (error) {
            res.status(500).json({message : error.message})
    }





}

export const deleteData = async (req, res) => {
    
    let user = await StudentModel.findById(req.params.id);
    let imageID = user.public_id;
    if(imageID){
    await cloudinary.uploader.destroy(imageID);
    }
    await StudentModel.deleteOne({ _id: req.params.id })
    res.redirect('/crudRoutes/read');


}

export const search = async (req, res) => {

    let key = req.query.value;


    let searchCon = [

        { username: { $regex: key, $options: 'i' } },
        { user_email: { $regex: key, $options: 'i' } }
    ]

    if (!isNaN(key)) {
        searchCon.push({ $or: [{ age: Number(key) }, { sid: Number(key) }] })
    }

    let data = await StudentModel.find({
        $or: searchCon
    })
     console.log(data);
     
    res.render('search', { data, key })
}

export const getImage = async (req, res) => {
    let data = await StudentModel.findOne({ _id: req.params.id })
    
    res.render('image', { data })
    // console.log(data.photo);

} 