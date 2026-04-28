const applications=require('../Models/applicationModel')

//USER
exports.addApplication=async(req,res)=>{
    try{
        const {fullname,qualification,email,phone,coverletter,jobid,jobtitle}=req.body
        const resume=req.file?.filename
        const existingapplication=await applications.findOne({email,jobid})
        if(existingapplication){
            res.status(400).json("Application already exist!!!")
        }
        else{
            const newApplication=new applications({
                fullname,qualification,email,phone,coverletter,jobid,jobtitle,resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    }
    catch(err){
        console.log(err)
        res.status(200).json(err)
    }
}

//ADMIN
exports.listApplications=async(req,res)=>{
    try{
        const applicationList=await applications.find()
        res.status(200).json(applicationList)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}