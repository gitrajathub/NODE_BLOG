const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const fs = require('fs');

const userRoutes = require('./routes/userRoutes');


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();
const mongo_uri = process.env.mongo_uri; 
const port = process.env.port || 6000;

mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  app.use('/user', userRoutes);

