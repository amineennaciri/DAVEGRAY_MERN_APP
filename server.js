const express = require('express');
const path = require('path');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const corsOption = require('./config/corsOptions');
const app = express();

const PORT = process.env.PORT || 3500;

// middlewares
// CORS
app.use(cors(corsOption));
// this middleware handle urlencoded form data
app.use(express.urlencoded({extended: false}));
// this middleware is for json
app.use(express.json());
// this middleware serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
// routes
app.use('/', require('./routes/root'));
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