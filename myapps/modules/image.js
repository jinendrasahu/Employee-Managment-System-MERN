var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/employee",{useNewUrlParser:true});
var conn=mongoose.connection;
var imageSchema=new mongoose.Schema({
  imagefile:String,
});
var imageModel=mongoose.model('UploadImage',imageSchema);

module.exports=imageModel;