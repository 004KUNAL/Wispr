require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user')
const postModel = require('./models/post')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const post = require('./models/post')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get('/', function(req, res){
    res.render('landing')
})

app.get('/signup', function(req, res){
    res.render('index')
})

app.get('/login', function(req, res){
    res.render('login')
})

app.get('/delete/:id', async function(req, res){
    let deletePost = await postModel.findOneAndDelete({ _id: req.params.id })
    res.redirect('/profile')
})

// Like / Unlike toggle
app.get('/like/:id', isLoggedIn, async function(req, res){
    let post = await postModel.findOne({ _id: req.params.id })
    let liked = false;
    if(post.likes.indexOf(req.user.id) === -1){
        post.likes.push(req.user.id)
        liked = true;
    } else {
        post.likes.splice(post.likes.indexOf(req.user.id), 1)
        liked = false;
    }
    await post.save()

    // Handle AJAX request (Fetch)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ liked, count: post.likes.length });
    }

    res.redirect('/profile')
})

// Edit post — show edit form
app.get('/edit/:id', isLoggedIn, async function(req, res){
    let post = await postModel.findOne({ _id: req.params.id })
    res.render('edit', { post })
})

// Edit post — save updated content
app.post('/edit/:id', isLoggedIn, async function(req, res){
    await postModel.findOneAndUpdate(
        { _id: req.params.id },
        { content: req.body.content }
    )
    res.redirect('/profile')
})

app.get('/profile', isLoggedIn, async function(req, res){ 
    let loggedInUser = await userModel.findOne({ email: req.user.email })
    // Fetch ALL posts from ALL users, newest first, with author info
    let posts = await postModel.find().populate('user').sort({ date: -1 })
    res.render('profile', { posts, loggedInUser })
})

app.post('/post', isLoggedIn, async function(req, res){ 
    let user = await userModel.findOne({email : req.user.email})
    let {content} = req.body
    let post = await postModel.create({
        user : user._id,
        content,

    })
    user.posts.push(post._id)
    await user.save()
    res.redirect('/profile')
})

app.post('/register', async function(req, res){
    let { name ,username, email, age, password} = req.body
    let user = await userModel.findOne({email})
    if(user) return res.status(500).redirect('/');
    
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, async function(err, hash){
           let user = await userModel.create({
                username,
                name,
                email,
                age,
                password : hash
            })
            let token = jwt.sign({email : email, id : user._id}, process.env.JWT_SECRET)
            res.cookie('token', token)
            res.redirect('/profile')
            
        })
    })
     
})

app.post('/login', async function(req, res){
    let {  email, password} = req.body
    let user = await userModel.findOne({email})
    if(!user) return res.status(500).send('user not exist');

    bcrypt.compare(password, user.password, function(err, result){
        if(result) {
            let token = jwt.sign({email : email, id : user._id}, process.env.JWT_SECRET)
            res.cookie('token', token)
            res.status(200).redirect('/profile')
        } else res.redirect('/login')
    })
         
})

app.get('/logout', function(req, res){
    res.cookie('token', '')
    res.redirect('/login')
})

function isLoggedIn(req, res, next){
    if(req.cookies.token === '') res.redirect('/login')
    else{
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        req.user = data
        next()
    }
}

app.listen(process.env.PORT || 3000)