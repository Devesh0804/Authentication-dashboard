import express from 'express'
import { getData ,getViewData, getinsertData ,insertData ,getUpdateData,updateData,deleteData, search ,getImage } from '../Controller/crudcontroller.js';
import multer from 'multer'
import path from 'path'



const router = express.Router();



/* file-:
fieldname: 'photo',
  originalname: 'IMG_2690.JPG',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: './uploads',
  filename: '1765303016704.JPG',
  path: 'uploads\\1765303016704.JPG',
  size: 8649839
*/


const Storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        // console.log(file);
        
            callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        let fileName = Date.now() + path.extname(file.originalname)
        callback(null,fileName)
        // console.log(file)
    }
})

const fileFilter = (req,file,callback)=>{
    if(file.mimetype.startsWith('image/')){
         callback(null,true)
    }
    else{
        callback(new Error ('only images are allowed'), false)
    }
}
      
const INSERTING = multer({
    storage : Storage,
    fileFilter : fileFilter,
    limits :  { fileSize : 1024 * 1024 * 50 }  

})




router.get('/read',getData)

router.get('/insert',getinsertData)

router.post('/insert',INSERTING.single('photo'),insertData)

router.get('/update/:id',getUpdateData)

router.post('/update/:id',INSERTING.single('photo'),updateData)

router.get('/delete/:id',deleteData)

router.get('/view/:id',getViewData)

router.get('/search',search)

router.get('/image/:id', getImage)



export default router;