const mongoose=require('mongoose')

const jobschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    jobtype:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    
})

const jobs=mongoose.model('jobs',jobschema)
module.exports=jobs