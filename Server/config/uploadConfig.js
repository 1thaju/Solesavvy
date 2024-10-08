const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename : function(req,file,cb){
        cb(null, `${Date.now()}-${file.originalname}`);    },
})

/*const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('/image')){
        cb(null,true)
    }
    else{
        cb(new Error ('NOt an Image',false))
    }
}*/
const upload = multer({
    storage:storage,
   // fileFilter:fileFilter
})
module.exports = upload