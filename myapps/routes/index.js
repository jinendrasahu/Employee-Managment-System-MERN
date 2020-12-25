var express = require('express');
var multer=require('multer');
var path=require('path');
var jwt=require("jsonwebtoken");
var empModel=require('../modules/employee');
var imgModel=require('../modules/image');
const { token } = require('morgan');
var router = express.Router();
var employee=empModel.find({});
var imagedata=imgModel.find({});
/* GET home page. */

function chechLogin(req,res,next){
  var myToken=localStorage.getItem('myToken');
  try{
    jwt.verify(myToken,"logintoken");
  }
  catch(err){
  res.send("You neet to loogin to access Page");
  }
  next();
}
router.get('/',chechLogin, function(req, res, next) {
  employee.exec((err,data)=>{
    if(err) throw err;
    res.render('index', { title: "Employee Records",records:data });
  });
  
});
router.get('/delete/:id', function(req, res, next) {
  var id=req.params.id;
  var dltEmployee=empModel.findByIdAndDelete(id);
  dltEmployee.exec((err,data)=>{
    if(err) throw err;
    res.redirect('/');
  });
  
});
router.get('/edit/:id', function(req, res, next) {
  var id=req.params.id;
  var editEmployee=empModel.findById(id);
  editEmployee.exec((err,data)=>{
    if(err) throw err;
    res.render('edit', { title: "Edit Records",records:data });
  });
});


router.use(express.static(__dirname+"./public/"));

var Storage=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,profile,cb)=>{  //fieldname=name=""
    cb(null,profile.fieldname+"_"+Date.now()+path.extname(profile.originalname));
  }
});
var Stor=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{  //fieldname=name=""
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
var upload=multer({
  storage:Stor
}).single('file');//file=name=""

var uploads=multer({
  storage:Storage
}).single('profile');//file=name=""

router.post('/file',upload, function(req, res, next) {

  var imagefile=req.file.filename;
    
 var imageDetails=new imgModel({
imagefile:imagefile
 });
 imageDetails.save((err,doc)=>{
if(err) throw err;
imagedata.exec((err,data)=>{
  if(err) throw err;
  res.render('uploadImg',{title: "upload",imgdata:data});
});

 });
});
router.get('/file',function(req, res, next) {
imagedata.exec((err,data)=>{
  if(err) throw err;
  res.render('uploadImg',{title: "upload",imgdata:da});
});
});


if(typeof localStorage==="undefined" || localStorage===null){
  const LocalStorage=require("node-localstorage").LocalStorage;
  localStorage=new LocalStorage('./scratch');
}
router.get('/login',function(req,res,next){
  var token=jwt.sign({foo:'bar'},'logintoken');
  localStorage.setItem('myToken',token);
res.send(('login success'))
});
router.get('/logout',function(req,res,next){
  localStorage.removeItem("myToken");
res.send('logout success')
});

router.post('/',uploads,(req,res,next)=>{
  var empDetails=new empModel({
    name:req.body.name,
    email:req.body.email,
    etype:req.body.etype,
    hourlyrate:req.body.rate,
    totalhours:req.body.total,
    total:parseInt(req.body.rate)*parseInt(req.body.total),
    image:req.file.filename

  });
  empDetails.save((errr,data)=>{
    if(errr) throw errr;
    employee.exec((err,data)=>{
      if(err) throw err;
      res.render('index', { title: "Employee Records",records:data });
    });
  });
  
});
router.post('/update/',uploads,(req,res,next)=>{
    var update=empModel.findByIdAndUpdate(req.body.id,{
      name:req.body.name,
      email:req.body.email,
      etype:req.body.etype,
      hourlyrate:req.body.rate,
      totalhours:req.body.total,
      total:parseInt(req.body.rate)*parseInt(req.body.total),
      image:req.file.filename
  
    });

    update.exec((err,data)=>{
      if(err) throw err;
      res.redirect('/');
    });
  
});

router.post('/search/',(req,res,next)=>{
  var fltname=req.body.fltname;
  var fltemail=req.body.fltemail;
  var flttype=req.body.fltetype;
if(flttype!='' && fltname!='' && fltemail!=''){
  var fltemployee={$and:[{name:fltname},{$and:[{email:fltemail,etype:flttype}]}]};
}
else if(flttype=='' && fltname!='' && fltemail!=''){
  var fltemployee={$and:[{name:fltname},{email:fltemail}]};
}
else if(flttype!='' && fltname=='' && fltemail!=''){
  var fltemployee={$and:[{etype:flttype},{email:fltemail}]};
}
else if(flttype!='' && fltname!='' && fltemail==''){
  var fltemployee={$and:[{etype:flttype},{name:fltname}]};
}
else{
  var fltemployee={};
}

var employeeFilter=empModel.find(fltemployee);
    employeeFilter.exec((err,data)=>{
      if(err) throw err;
      res.render('index', { title: "Employee Records",records:data });
    });
});

router.get('/autocomp/',(req,res,next)=>{
  var regex=new RegExp(req.query['term'],'i');
  var empfilter=empModel.find({name:regex},{'name':1}).sort({'update_at':-1}).sort({'created-at':-1}).limit(20);
  empfilter.exec((err,data)=>{
    console.log(data);
    var result=[];
    if(!err) {
     if(data && data.length && data.length>0){
         data.forEach(user=>{
           let obj={
             id:user._id,
             label:user.name
           };
           result.push(obj);
         });
     }  
     res.jsonp(result);
    }

  });
});

module.exports = router;



