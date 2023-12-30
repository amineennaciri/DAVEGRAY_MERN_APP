const allowedOrigins = require('./allowedOrigins');

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);//null for no error, and true to let the client access the api
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
};

module.exports = corsOption;