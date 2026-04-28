const users=require('../Models/userModel')
const jwt=require('jsonwebtoken')
exports.signup=async(req,res)=>{
    try{
        const {username,password,email}=req.body
        console.log(req.body)
        if(!username || !email || !password){
        res.status(400).json("Invalid Data ")
        }
        else{
            const existuser=await users.findOne({email})
            if(existuser){
                res.status(400).json("User Already exist")
            }
            else{
                const user=new users({
                    username:username,email:email,password:password
                })
                await user.save()
                res.status(200).json("Signup Success")
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(404).json("Something went Wrong!!")
    }
    
}
exports.signin=async(req,res)=>{
    const {password,email}=req.body
    if(!email || !password){
        res.status(400).json("Invalid Data")
    }
    else{
        const user=await users.findOne({email,password})
        if(user){
            const token=jwt.sign({email:user?.email,role:user?.role},process.env.SECRET_KEY)
            res.status(200).json({token,username:user?.username,profile:user?.profile,role:user?.role,bio:user?.bio})
        }
        else{
            res.status(400).json("Invalid Email/Password")
        }
        
        
    }
}
exports.googleSignin=async(req,res)=>{
    try{
        const {username,email,profile}=req.body
        const existingUser=await users.findOne({email})
        console.log(existingUser)
        let role=""
        if(!existingUser){
            const newUser=new users({
                username,email,profile
            })
            await newUser.save()
            role=newUser.role
            console.log(role)
        }
        else{
            role=existingUser.role
        }
        const token=jwt.sign({email:email},process.env.SECRET_KEY)
        res.status(200).json({token, username:username,profile:profile,role:role,bio:existingUser.bio})
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
}

exports.getProfile=async(req,res)=>{
    try{
        const userMail=req.payload
        const userData=await users.findOne({email:userMail})
        res.status(200).json(userData)
    }
       catch(err){
       console.log(err)
       res.status(500).json(err)
    }
}

exports.profileUpdate=async(req,res)=>{
   try{
     const {username,password,bio,profile,role}=req.body
    const profilePicture=req.file? req.file.filename:profile
    const email=req.payload 
    const updateUser=await users.findOneAndUpdate({email},{username,password,bio,profile:profilePicture,role},{new:true})
    updateUser.save()
    res.status(200).json(updateUser)
   }
   catch(err){
    console.log(err)
    res.status(500).json(err)
   }
}

//ADMIN 
exports.getAdminAllUsers=async(req,res)=>{
    try{
        const userMail=req.payload
        const userlist=await users.find({email:{$ne:userMail}})
        res.status(200).json(userlist)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}