var express = require('express');
var multer=require('multer');
var path=require('path');
var jwt=require("jsonwebtoken");
var imgModel=require('../modules/image');
var router = express.Router();

var Storage=multer.diskStorage({
    destination:(req,file,cb)=>{  
        cb(null,"./public/uploads/");
      },
    filename:(req,file,cb)=>{  
      cb(null,Date.now()+file.originalname);
    }
  });

  const filefilter=(req,file,cb)=>{
      if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' ||file.mimetype==='image/png'){
          cb(null,true);
      }
      else{
          cb(null,false);
      }
  }
  var upload=multer({
    storage:Storage,
    limits:{
        fileSize:1024*1024*5//5mb
    },
    fileFilter:filefilter
  });
  

router.post('/',upload.single('file'), function(req, res, next) {

   var img=new imgModel({imagefile:req.file.filename});
   img.save((err,data)=>{
       if(err) throw err;
       res.send("image uploaded");
   })
    
  });

  module.exports=router;