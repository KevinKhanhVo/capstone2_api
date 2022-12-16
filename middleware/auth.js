const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');


/**
 * Middleware to authenticate user login. 
 * It will check if the request has a current username.
 * If so, it will proceed to the next route.
 * If not, it will out an error for login required.
 */
function loginRequired(req, res, next){
    try{
        if(req.current_username){
          return next();
        } 
        else{
          return next({ status: 401, message: "Login required."});
        }
    }catch(err){
        return next(err);
    }
}

/**
 * Middleware for user authentication.
 * Check for token in the header. 
 * If there is no token, then it will out an error to login.
 * Otherwise, it will set the username and user id from the token.
 * To allow for access to authenticated routes.
 */
function authUser(req, res, next) {
    try {
      const token = req.headers.authorization;
        if (token) {
  
        let payload = jwt.verify(token, SECRET_KEY);
        req.current_username = payload.username;
        req.current_user_id = payload.user_id;
      }
      
      return next();
    } catch (err) {
      return next(err);
    }
  }

module.exports = {
    loginRequired,
    authUser
}