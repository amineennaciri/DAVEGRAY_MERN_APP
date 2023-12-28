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

module.exports = corsOption;