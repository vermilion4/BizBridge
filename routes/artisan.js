const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var AWS = require('aws-sdk');


let fs = require('fs');
let path = require('path');
let multer = require('multer');

const { ensureAuthenticated } = require('../config/auth');

const Artisan = require('../model/Artisan');


// MULTER
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    console.log(file);
    cb(null, file.fieldname +'-'+ Date.now());
  }
})

let upload = multer({storage:storage});


router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/login', (req,res)=>{
    res.render('login');
})

router.post('/register',upload.single('image'),(req,res)=>{
    
    const { cName,cNumber,email,bName,industry,cacStatus,title,staffStrength,
            address,city,web,uname,password,password2 } = req.body;

        var s3 = new AWS.S3();
        var myBucket =  encodeURIComponent('biz-bridge');

var myKey =  encodeURIComponent('jpg');
    let errors = [];

     //check required fields
   if(!cName || !cNumber || !email || !bName || !industry || !cacStatus || !title || 
    !staffStrength || !address || !city || !web || !uname || !password){
        errors.push({ msg : 'Please fill in all fields' });
   }

   //check passwords match
   if(password !== password2){
        errors.push({ msg : 'Passwords do not match' });
   }

   //check pass len
   if(password.length < 6){
       errors.push({ msg : 'Password should be at least 6 characters' });
   }

   if(errors.length > 0){
        res.render('register',{
            errors,
            cName,
            cNumber,
            email,
            bName,
            industry,
            cacStatus,
            title,
            staffStrength,
            address,
            city,
            web,
            uname,
            password,
            password2
        })
   }else{
        
				
       //Validation Passed
        Artisan.findOne({uname:uname})
        .then(artisan =>{
            if(artisan) {
            //User exists
            errors.push({msg:'Username is already taken'})
            res.render('register',{
            errors,
             cName,
            cNumber,
            email,
            bName,
            industry,
            cacStatus,
            title,
            staffStrength,
            address,
            city,
            web,
            uname,
            password,
            password2
        }) 
       } else{
        
        console.log(path)
           const newArtisan = new Artisan({
              cName,
            cNumber,
            email,
            bName,
            industry,
            cacStatus,
            title,
            staffStrength,
            address,
            city,
            web,
            uname,
            password,
            password2,
            upload:{
              // data:fs.readFileSync(path.join(__dirname+'/uploads/'+req.file.filename)),
              data: fs.readFile(path.join('uploads/'+req.file.filename), function (err, data) {
  if (err) { throw err; }

     params = {Bucket: myBucket, Key: myKey, Body: data };
     s3.putObject(params, function(err, data) {
         if (err) {
             console.log(err)

         } else {

             console.log("Successfully uploaded data to myBucket/myKey");
         }

      })
    }),
            contentType: 'image/png'
            }
                })
            //hash password
            bcrypt.genSalt(10, (err,salt)=> 
                bcrypt.hash(newArtisan.password, salt, (err, hash)=>{
                    if(err) throw err;

                    //set password to hashed
                    newArtisan.password = hash;
                    
                     //save user
                    newArtisan.save()
                        .then(artisan=>{
                            req.flash('success_msg', 'You have been registered successfully,proceed to login');
                            res.redirect('/artisan/login');
                        })
                        .catch(err => console.log(err));
                
            
                   
                }));

            }
            
        })
        .catch(err => console.log(err))
      }

    })


    router.post('/login', (req,res)=>{
      console.log(req.body)
     const { uname,password } = req.body;
       Artisan.findOne({uname:uname}, function(err,result){
         console.log(result)
         if(err){
           console.log(err)
         }else{
           bcrypt.compare(password, result.password, (err, isMatch)=>{
                if(err) throw err;

                if(isMatch){
                    res.render('dashboard',{record:result})
                }else{
                    return {message: 'Incorrect password'};
                }
       })
      }
    })
  })
             
          

    //dashboard route
router.get('/dashboard',ensureAuthenticated,function(req,res){
    res.render('dashboard',{name:req.user.uname})

})

 //logout handle
     router.get('/logout', (req,res)=>{
         req.logOut();
         req.flash('success_msg', 'you are logged out');
         res.redirect('/artisan/login');
     })
   


module.exports = router;