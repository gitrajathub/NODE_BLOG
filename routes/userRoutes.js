const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/userModel');
const Post = require('../models/postModel');


const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/profile', userController.profile);
router.post('/logout', userController.logout);
router.post('/post', userController.post);
router.put('/update', userController.update);


module.exports = router;
