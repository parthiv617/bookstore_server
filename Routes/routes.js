const express=require('express')
const userController=require('../Controllers/userController')
const bookController=require('../Controllers/bookController')
const jobController=require('../Controllers/jobController')
const multerConfig=require('../Middlewares/multerMiddleware')
const applicationController=require('../Controllers/applicationController')


const jwtmiddle=require('../Middlewares/jwtMiddleware')
const adminjwtmiddle=require('../Middlewares/adminJwtMiddleware')
const pdfMulterMiddle=require('../Middlewares/pdfMulterMiddleware')

const router=express.Router()


//USER
router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/google-login',userController.googleSignin)
router.get('/get-profile',jwtmiddle,userController.getProfile)
router.put('/profile-update',jwtmiddle,multerConfig.single('profile'),userController.profileUpdate)
router.get('/list-jobpost',jwtmiddle,jobController.listJobPosts)


//BOOKS
router.post('/add-book',jwtmiddle,multerConfig.array('uploadImg',3),bookController.addBook)
router.get('/all-books',jwtmiddle,bookController.allBooksList)
router.get('/getbookbyid/:bid',jwtmiddle,bookController.getBookById)
router.get('/latestbook',bookController.showLatestBook)
router.get('/getbookbyid/:bid',jwtmiddle,bookController.getBookById)
router.get('/user-books',jwtmiddle,bookController.getUserBooks)
router.delete('/getbook/:bid/delete',jwtmiddle,bookController.deleteBookById)
router.get('/bought-books',jwtmiddle,bookController.getBoughtBooks)
router.post('/apply-jobpost',jwtmiddle,pdfMulterMiddle.single('resume'),applicationController.addApplication)
router.post('/purchase-book',jwtmiddle,bookController.purchaseBookStripe)


//ADMIN
router.get('/admin/get-books',adminjwtmiddle,bookController.getAllAdminBooks)
router.get('/admin/get-users',adminjwtmiddle,userController.getAdminAllUsers)
router.patch('/admin/approve-book/:bid',adminjwtmiddle,bookController.approveBook)
router.post('/admin/add-job',adminjwtmiddle,jobController.addJobPost)
router.get('/admin/list-jobpost',adminjwtmiddle,jobController.listJobPosts)
router.delete('/admin/delete-jobpost/:jid',adminjwtmiddle,jobController.deleteJobPost)
router.get('/admin/get-applications',adminjwtmiddle,applicationController.listApplications)

module.exports=router