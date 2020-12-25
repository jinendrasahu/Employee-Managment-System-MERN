var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/employee",{useNewUrlParser:true});
var conn=mongoose.connection;
var employeeSchema=new mongoose.Schema({
  name:String,
  email:String,
  etype:String,
  hourlyrate:Number,
  totalhours:Number,
  total:Number,
  image:String
});
var employeesModel=mongoose.model('Employee',employeeSchema);

module.exports=employeesModel;