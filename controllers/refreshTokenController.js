const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req,res) => {
    const cookies = req.cookies;
    /* !cookies?.jwt we are checking if there is cookies and after that if there is a jwt property */
    if(!cookies?.jwt) return res.sendStatus(401);
    /* console.log(cookies.jwt); */
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) return res.sendStatus(403); //forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {   "UserInfo": {
                    "username": decoded.username,
                       "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}/*set it longer in prod*/
            );
            res.json({ accessToken });
        }
    );
}

module.exports = {handleRefreshToken};