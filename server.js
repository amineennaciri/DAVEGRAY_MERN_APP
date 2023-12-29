const express = require('express');
const path = require('path');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const corsOption = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const app = express();

const PORT = process.env.PORT || 3500;

// middlewares
// custom middleware logger
app.use(logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// CORS
app.use(cors(corsOption));
// this middleware handle urlencoded form data
app.use(express.urlencoded({extended: false}));
// this middleware is for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());
// this middleware serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
// any route after the verifyJWT middleware will have to get verified with JWT
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// routes for 404 responses
app.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({ errors: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
})
// middleware to handle errors
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));