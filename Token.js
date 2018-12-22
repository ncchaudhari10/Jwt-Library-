const jwt = require('jsonwebtoken');
const secret_key = "secret_Key";


function getToken(payload) {

    let signoptions = {
        expiresIn: 60,
        // issuer:"",                         //clients_id 
        // jwtid:"",                          // unique id for token to prevent reuse of the token
        // subject:"",                       // Subject to // will contain id of client
        // audience:[ " "," "]               // array of strings
    }

    let token = jwt.sign(payload, secret_key, signoptions);
    console.log("token has signed")
    return token;

}

function verifyToken(token, callback) {

    let options = {
        ignoreExpiration: false,                           // data type boolean will check first whether token is expired or not
        // subject:" ",                                         // if you want to check the subject
        // clockTolerance

    }
    let decode = decodeToken(token);

    if (decode === null || decode == 'undefined') {
        console.log("Invalid Token")                    // callback({msg:"Invalid Token",state:false})
    }
    else {
        jwt.verify(token, secret_key, options, (err, decoded) => {
            if (err) {

                if (err.name === 'TokenExpiredError') {
                    err1 = {
                        name: 'TokenExpiredError',
                        msg: 'jwt expired',
                        state: false
                    }
                    callback(err1);
                }
                else if (err.name === "JsonWebTokenError") 
                {
                    console.log("Invalid token Signature");             // replace with callback({msg:"Invalid Token Signature"})
                }
                else {

                    console.log(err.name);
                    callback({ msg: err.name, state: false });
                }

            }
            else {
                console.log(" Valid token")
                msg = {
                    "decodedvalue": decoded,
                    "msg": "Valid token no need to refresh",
                    "state": true
                }
                callback(msg);
            }

        });
    }
}
function refreshToken(token, payload)                 // need to provide a callback
{
    verifyToken(token, (result) => {
        //console.log(result.state);
        if (result.state == true) {

            console.log("token state:" + result.state)
            console.log(result.decodedvalue.exp - result.decodedvalue.iat);
            return;                   //callback({ result})
        }
        else {
            console.log(result.msg);
            let token1 = getToken(payload)
            token = token1;
            console.log(token);
            return;
            //return token;   //callback(token)
        }

    });



}
function decodeToken(token) {
    let decoded;
    try {
        decoded = jwt.decode(token);
        return decoded;
    }
    catch (e) {
        console.log("decodeToken throws Syntaxerror");
        return null;
    }



}

let payload = {

    "name": "John Doe",
    "email": "johndoe@gmail.com"

}




module.exports = {

    getToken, refreshToken

}
