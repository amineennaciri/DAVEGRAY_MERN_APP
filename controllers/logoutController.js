const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req,res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    /* !cookies?.jwt we are checking if there is cookies and after that if there is a jwt property */
    if(!cookies?.jwt) return res.sendStatus(204);// no content to send back
    const refreshToken = cookies.jwt;
    // is refresh token in DB?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});/*erase the cookie that was sent*/
        return res.sendStatus(204); //success but no content
    } 
    // Delete the refreshToken in DB
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken:''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

module.exports = {handleLogout};