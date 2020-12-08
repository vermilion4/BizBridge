const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

//Load user model
const Artisan = require('../model/Artisan');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'uname'}, (uname,password,done)=>{
            //match artisan
            Artisan.findOne({uname:uname})
                .then(artisan=>{
                    if(!artisan){
                        return done(null, false, {message: 'That Username is not registered'});
                    }

            //match password
            bcrypt.compare(password, artisan.password, (err, isMatch)=>{
                if(err) throw err;

                if(isMatch){
                    return done(null, artisan)
                }else{
                    return done(null, false, {message: 'Incorrect password'});
                }
            })
                })
                .catch(err => console.log(err));
        })
    )

    passport.serializeUser(function(artisan, done) {
  done(null, artisan.id);
});

passport.deserializeUser(function(id, done) {
  Artisan.findById(id, function(err, artisan) {
    done(err, artisan);
  });
});
}