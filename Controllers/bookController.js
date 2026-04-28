const books=require('../Models/bookModel')

const stripe=require('stripe') (process.env.STRIPE_SECRET)

exports.addBook=async(req,res)=>{
    // console.log("Add Book API")
    try{
    const {title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,category}=req.body
    const uploadImg=[]
    const userMail=req.payload
    req.files.forEach(item=>{uploadImg.push(item.filename)})
    console.log(title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,category,uploadImg,userMail)
    // console.log(req.Body)
    // console.log(req.files)
    const existingBook=await books.findOne({userMail,title})
    console.log(existingBook)
    if(existingBook){
        res.status(401).json("You Have already Added the book ")
    }
    else{
        const newBook= new books({
            title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,category,uploadImg,userMail
        })
        await newBook.save()
        res.status(200).json("Book Added Successfully")
    }
    }
    catch(err){
         console.log(err)
         res.status(500).json(err)
    }
}

exports.allBooksList=async (req,res)=>{
    try{
        const userMail=req.payload
        const {search}=req.query
        console.log(search)
        let filter={}
        search ? filter={userMail:{$ne:userMail},title:{$regex:search,$options:'i'}} : 
        filter={userMail:{$ne:userMail}}
        const booklist=await books.find(filter)
        res.status(200).json(booklist)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//fetch book document by id 

exports.getBookById=async(req,res)=>{
    try{
        const {bid}=req.params
    const bookData=await books.findById(bid)                                  //findByID - mongoose method to get data using mongoDB ID 
    res.status(200).json(bookData)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

exports.showLatestBook=async(req,res)=>{
    try{
        const latestBooks=await books.find().sort({_id:-1}).limit(4)
        console.log(latestBooks)
        res.status(200).json(latestBooks)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
    }

}

// fetch books added by authorized user
exports.getUserBooks=async(req,res)=>{
    try{
        const usermail=req.payload
        const booklist=await books.find({userMail:usermail})
        res.status(200).json(booklist)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
        
    }
}

// delete books by user
exports.deleteBookById=async(req,res)=>{
    try{
        const{bid}=req.params
        const deleteBook=await books.findByIdAndDelete(bid)
        res.status(200).json(deleteBook)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
        
    }
}

// book list purchased by user
exports.getBoughtBooks=async(req,res)=>{
    try{
        const usermail=req.payload
        const boughtBookList=await books.filter({bought:usermail})
        res.status(200).json(boughtBookList)
    }
    catch(err){
        console.log(err);
        res.status(500).json(err)
        
    }
}

// Admin Based Conrollers

exports.getAllAdminBooks = async (req, res) => {
  try {
    const booklist = await books.find()
    res.status(200).json(booklist)
  }
  catch (err) {
    res.status(400).json(err)
  }
}

exports.approveBook=async(req,res)=>{
    try{
        const {bid}=req.params
        const updateBook=await books.findByIdAndUpdate(bid,{status:"approved"},{new:true})
        updateBook.save()
        res.status(200).json(updateBook)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//purchase book
exports.purchaseBookStripe=async(req,res)=>{
    try{
    const {_id,title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,category,uploadImg,userMail}=req.body
    const email=req.payload
    const updatedBook=await books.findOneAndUpdate({_id},{
           title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,uploadImg,category,userMail,status:'sold',bought:email
    },{new:true})
    //checkout session 

    const line_items=[{
        price_data:{
            currency:'usd',
            product_data:{
                name:title,
               images:[image],
                description:`${author} | ${publisher}`

            },
          
            unit_amount:Math.round(discountPrice*100)

        },
        quantity:1
    }]
      metadata={
                title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,uploadImg,category,userMail,status:'sold',bought:email
            }
    const session=await stripe.checkout.sessions.create({
        success_url:"bookstore-fe-orpin.vercel.app/payment-success",
        cancel_url:"bookstore-fe-orpin.vercel.app/payment-error",
        payment_method_types:['card'],
        line_items,
        mode:'payment'
    })
    console.log(session)
    res.status(200).json({checkoutPaymentUrl:session?.url})
}
catch(err){
    console.log(err)
    res.status(500).json(err)
}
}