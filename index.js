import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import * as validation from './validations.js';
import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js';
import {PostController,UserController} from './controllers/index.js'
import cors from 'cors'
mongoose.connect('mongodb+srv://woniderhaf:Kirill2002@cluster0.0jmsf.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('------- DB ok --------'))
  .catch(err => console.log('db Error -->> ', err))

const app =  express()
app.use(cors())
const storage = multer.diskStorage({
  destination: ( _, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', validation.login, handleValidationErrors, UserController.login)
app.post('/auth/register', validation.register, handleValidationErrors,  UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload',checkAuth, upload.single('image'), (req,res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/posts', PostController.getAll)
app.get('/tags', PostController.getLastTags)
app.get('/posts/:postId',checkAuth, PostController.getOne)
app.post('/posts',checkAuth, validation.postCreate,handleValidationErrors, PostController.create)
app.delete('/posts/:postId',checkAuth, PostController.remove)
app.patch('/posts/:postId', checkAuth,validation.postCreate,handleValidationErrors, PostController.update)

app.get('/', function(req, res){
  res.json('all is good');
});
app.listen(4444, (err) => {
  if (err) return console.log(err)
  console.log(' -------- server ok -------- ')
  
})