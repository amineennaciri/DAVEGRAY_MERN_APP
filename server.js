const express = require('express');
const path = require('path');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const app = express();

const PORT = process.env.PORT || 3500;

// middlewares
// CORS
// whitelist (domains that can access the API)
const whitelist = ['https://www.yourfrontendsite.com',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5173',
    'http://localhost:3500',
    ];
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin)=== -1 || !origin){
            callback(null, true);//null for no error, and true to let the client access the api
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
};
app.use(cors(corsOption));
// this middleware handle form data
app.use(express.urlencoded({extended: false}));
// this middleware is for json
app.use(express.json());
// this middleware serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));
// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

app.get('^/$|/index(.html)?', (req,res)=>{
    //res.sendFile("./views/index.html", {root: __dirname});
    res.sendFile(path.join(__dirname,'views','index.html'));
})

app.get('/new-page(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname,'views','new-page.html'));
})

app.get('/old-page(.html)?', (req,res)=>{
    res.redirect(301, '/new-page.html');
})

// Route handlers
app.get('/hello(.html)?', (req, res, next)=>{
    console.log('attempted to load hello.html');
    next();
}, (req,res)=>{
    res.send('Hello World!');
})

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