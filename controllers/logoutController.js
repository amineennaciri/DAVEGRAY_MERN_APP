const User = require('../model/User');

const handleLogout = async (req,res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    /* !cookies?.jwt we are checking if there is cookies and after that if there is a jwt property */
    if(!cookies?.jwt) return res.sendStatus(204);// no content to send back
    const refreshToken = cookies.jwt;
    // is refresh token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});/*erase the cookie that was sent*/
        return res.sendStatus(204); //success but no content
    } 
    // Delete the refreshToken in DB
    foundUser.refreshToken = '';
    const result = await foundUser.save(); /*save changes to the collection in DB*/
    console.log(result);
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

module.exports = {handleLogout};