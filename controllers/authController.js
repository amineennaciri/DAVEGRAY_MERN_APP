const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req,res) => {
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({'message': 'Username and password are required.'});
    const foundUser = await User.findOne({ username: user }).exec();
    if(!foundUser) return res.sendStatus(401); //Unauthorized
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match){
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {   "UserInfo": {
                "username": foundUser.username,
                   "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        // saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(foundUser);
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite:'none', secure: true, maxAge:24*60*60*1000});
        /* we will send access token in a cookie available in http only (not vulnerable to javascript)
        cookie is always sent with every request. here the refreshToken will stay for 24 hours */
        res.json({accessToken});//to be stored in memory by the front end
    }else {
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};