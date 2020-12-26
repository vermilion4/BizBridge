const multer = require('multer');

const express = require('express'),
        ejs = require('ejs'),
        mongoose = require('mongoose'),
        app = express();
        flash = require('connect-flash'),
        session = require('express-session'),
        passport = require('passport');
			


//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').uri;

//connect to mongo
mongoose.connect(db, { useNewUrlParser:true,useUnifiedTopology:true })
    .then(()=> console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');


//express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//Routes
app.use('/', require('./routes/index'))
app.use('/artisan', require('./routes/artisan'))

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}


app.listen(port, ()=>{
    console.log('Server started on port 8080')
})
