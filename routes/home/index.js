const express = require('express');

const router = express.Router();

const post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// const {userauthenticate} = require('../../helpers/authentication');


router.all('/*', (req,res,next) =>{
    req.app.locals.layout = 'home';
    next();
})

router.get('/', (req, res)=>{

    // req.session.jitu = 'Jitesh Powankar';

    // if (req.session.jitu){
    //     console.log(`We found seseeion id ${ req.session.jitu}`);
    // }



    post.find({}).then((posts)=> {

        Category.find({}).then(categories =>{
            res.render('home/index', {posts: posts, categories: categories});
        })
    }).catch(err => {
        res.send(err);
    })

    
});

router.get('/about', (req, res)=>{
    res.render('home/about');
});

router.get('/login', (req, res)=>{
    res.render('home/login');
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {

    User.findOne({email: email}).then(user=>{
        
        if (!user) return done(null, false, {message: 'No user found'});

        bcrypt.compare(password, user.password, (err, matched)=>{

            if (err) return err;

            if (matched){
                return done(null, user)
            }else{

                return done(null, false, {message: 'Incorrect Password'});
            }
        })

    })

}

));

router.post('/login', (req, res,next)=>{
passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
})(req, res, next) 
});

 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  router.get('/logout',(req, res)=>{
    req.logOut();
    res.redirect('/login');

    // res.render('home/login');
  });

router.get('/register', (req, res)=>{
    res.render('home/register');
});

router.post('/register', (req, res)=>{

    let errors = [];

    if(!req.body.firstName){
        errors.push({
            message: "Please enter first Name"
        })
    }

    if(!req.body.lastName){
        errors.push({
            message: "Please enter last Name"
        })
    }

    if(!req.body.email){
        errors.push({
            message: "Please enter email"
        })
    }

    if(!req.body.password){
        errors.push({
            message: "Please enter password"
        })
    }

    if (req.body.password !== req.body.passwordConfirm){
        errors.push({
            message: "Passwod field don't match"
        });
    }

    if (errors.length > 0){

        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        
        });
    }else{

        User.findOne({email: req.body.email}).then(user=>{

            if(!user){

                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                }); 
        
                bcrypt.genSalt(10, function(err, salt){
        
                    bcrypt.hash(newUser.password, salt, function(err, hash){
        
                        // console.log(hash);
        
                        req.flash('success_message', 'You are registered, please login');
                        
                        newUser.password = hash;
        
                        newUser.save().then(user=>{
                    
                            res.redirect('/login');
                       })
        
                    })
        
                })

            } else {

                req.flash('error_message', 'User Already Exists, please login');

                res.redirect('/login');

            }

        })

        

     
       
    }
    
   

});

router.get('/post/:id', (req, res)=>{

    post.findOne({_id: req.params.id}).then(post => {

        Category.find({}).then(categories =>{
            res.render('home/post', {post: post, categories: categories});
        })
        
    })

});

module.exports = router;