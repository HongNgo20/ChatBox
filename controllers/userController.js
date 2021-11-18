
const express = require('express')
const bcrypt = require('bcrypt');
const router = express.Router()
// we need our User model
const User = require('../models/users')

  

router.get('/register', (req, res) => {
	res.render('users/register.ejs')
})

router.post('/register', (req, res) => {
	
	const salt = bcrypt.genSaltSync(10)
	
	console.log(req.body)
	req.body.password = bcrypt.hashSync(req.body.password, salt)
	console.log(req.body)
	// first let's see if somebody else already has this username
	User.findOne({username: req.body.username}, (error, userExists) => {
		if (userExists) {
			res.send('That username is taken! <a href="/users/signin/">Sign in</a>')
			
		}else{  
			User.create(req.body, (error, createdUser) => {
				req.session.currentUser = createdUser
				res.redirect('/messenger')
			})
		}
	})
})

router.get('/signin', (req, res) => {
		res.render('users/signin.ejs')
	}
)

router.get('/', function(req, res){
    Message.find({},(err, messages)=>{
      if (err) res.send(err);
      res.render("index.ejs",{username:req.username})
    })
  });

router.post('/signin', (req, res) => {
	// we need to get the user with that username
	User.findOne({ username: req.body.username}, (error, foundUser) => {
		if (foundUser) {
			// if they do exist, we need to compare their passwords
			// we can compare passwords using bcrypt's compareSync function
			const validLogin = bcrypt.compareSync(req.body.password, foundUser.password)
			// compareSync returns true if they match
			// and false if they don't
			// if the passwords match, log them in
			if (validLogin) {
				req.session.currentUser = foundUser
				// we're letting the session know
				// that we have a user logged in
				res.redirect('/messenger')
			} else {
				// if they don't match, send a message
				res.send('Invalid username or password')
			}
			
		} else {
			// if they don't exist, we need to send a message
			res.send('User doesnt exist. Please Register! <a href="/users/register/">Sign Up</a>')
			
		}
	})			
			
})




// // DESTROY session route
// router.get('/signout', (req, res) => {
// 	req.session.destroy()
// 	// this DESTROYs the session
// 	res.redirect('/messenger')
// })

module.exports = router