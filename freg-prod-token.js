// sign with default (HMAC SHA256)
var axios = require('axios');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var qs = require('qs');

// sign with RSA SHA256
var cert = fs.readFileSync('privateKey-prod.pem');  // get private key
var cert_pub = fs.readFileSync('publicKey-prod.pem');

// Start timer
console.time('Token request')

// Create JWT signed token with production sign certificate
var headerOptions = {
    x5c: ["<< Certificate Private key >>"],
    alg: "RS256",
  }

var body = {
    aud: 'https://maskinporten.no/', 
    iss: "<< Client ID >>",
    scope: "folkeregister:deling/privat",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120,
};

var token = jwt.sign(body, cert, { algorithm: 'RS256', header: headerOptions });
//console.log(jwt.verify(token, cert_pub, {complete: true}));
//console.log(token)


var data = qs.stringify({
  'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  'assertion': token
});

var config = {
  method: 'post',
  url: 'https://maskinporten.no/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};


axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data.access_token));

  // Stop timer
  console.timeEnd('Token request')

})
.catch(function (error) {
  console.log(error.response.data);
});
