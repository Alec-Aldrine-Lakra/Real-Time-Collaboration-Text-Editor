'use strict';
const router = require('express').Router();
const bParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../model/user-model');
const creds = require('../config/creds.json');
const session = require('express-session');
router.use(bParser.urlencoded({extended:true}));
router.use(session({
    name: creds.session_name,
    resave: false,
    saveUninitialized:false,
    secret: creds.session_key,
    cookie:{
         maxAge: 1000*60*60*12,
         sameSite: true,
         secure: false
    }
}))

const redirectLogin = (req,res, next)=>{
	if(!req.session.email)
		res.redirect('/login');
	else
		next();
}
const redirectHome = (req,res, next)=>{
	if(req.session.email)
		res.redirect('/home');
	else
		next();
}
router.get('/home',redirectLogin,(req,res)=>{
    User.findOne({email: req.session.email},{_id:1, fname:1},(err,result)=>{
        if(err)
            res.redirect('/logout');
        else
            res.render('home',{fname : result.fname, id: result._id});
    })
})

router.get('/login',redirectHome,(req,res)=>{
    res.render('login');
})

router.get('/signup',redirectHome,(req,res)=>{
    res.render('signup');
})

router.post('/login',redirectHome,(req,res)=>{
    let {email, password} = req.body;
    User.findOne({'email' : email},{_id:0, password:1},(err,result)=>{
        if(err)
            res.render('login',{err: 'DB Error, Try Again'});
        else if(result)
        {
            bcrypt.compare(password, result.password).then(function(val) {
                if(val){
                    req.session.email = email;
                    res.redirect('/home');
                }
                else
                    res.render('login',{err : 'Invalid Email Id Or Password'});
            }).catch(err=>{
                console.log(err);
            });
        }
        else
            res.render('login',{err: 'Invalid Email Id Or Password'});
    })
})

router.post('/signup',redirectHome,(req,res)=>{
    let {fname, lname, email, password2} = req.body;
    User.findOne({'email' : email},{_id:1},(err,result)=>{
        if(err)
            res.render('signup',{err: 'DB Error, Try Again'});
        else if(result)
            res.render('signup',{err : 'Email Id Already Exists'})
        else
        {
            bcrypt.hash(password2, 10).then(password=>{
                let user = new User({fname, lname, email, password});
                user.save(err=>{
                    if (err)
                        res.render('signup',{err: 'DB Error, Try Again'});
                    else{
                        req.session.email = email;
                        res.redirect('/home'); 
                    }
                })
            }).catch(err=>{
                res.render('signup',{err: 'DB Error, Try Again'});
            })
        }
    })
})

router.get('/logout',redirectLogin,(req,res)=>{
    req.session.destroy(err=>{
		if(err)
			res.redirect('/home');
		else{
			res.clearCookie(creds.session_name);
			res.redirect('/login');
		}
	})
})

module.exports = router;