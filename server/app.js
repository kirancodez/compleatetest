require('dotenv').config()
const express =  require("express");
const app = express();
var cookieParser = require('cookie-parser')
var cors = require('cors')
const mongoose = require("mongoose");

// Middlewares
app.use(express.json()) 
app.use(cookieParser())
app.use(cors())


// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const userCountroRoute = require("./routes/userControls")

// my routes
app.use(authRoute);
app.use(userRoute);
app.use(userCountroRoute);


mongoose.connect(process.env.DATABASE, 
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

app.listen(process.env.PORT);