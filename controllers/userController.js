const User = require('../models/userModel');
const Post = require('../models/postModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const dotenv = require("dotenv");
require('dotenv').config();

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

exports.register = async (req,res) => {
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } 
    catch(e) {
      console.log(e);
      res.status(400).json(e);
    }
  };


exports.login = async (req,res) => {
    
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
            id:userDoc._id,
            username,
        });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
};


exports.profile = async (req,res) => {
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
};


exports.logout = async (req,res) => {
    
    res.cookie('token', '').json('ok');
};


exports.post = async (req,res) => {

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
        title,
        summary,
        content,
        author:info.id,
        });
        res.json(postDoc);
    });

};


exports.update = async (req,res) => {
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
        return res.status(400).json('you are not the author');
        }
        await postDoc.update({
            title,
            summary,
            content
        });

        res.json(postDoc);
    });

};

