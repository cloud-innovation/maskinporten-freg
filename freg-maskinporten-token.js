// Import requirements
var axios = require('axios');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var qs = require('qs');

// Read certificate private key from file
var cert = fs.readFileSync('privateKey.pem');

//
// Create JWT signed token
//

// Set header and body for signing 
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

// Sign JWT token and create payload for request
var token = jwt.sign(body, cert, {
  algorithm: 'RS256',
  header: headerOptions
});

var data = qs.stringify({
  'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  'assertion': token
});


//
// Send token request to Maskinporten
//

// Set config for request
var config = {
  method: 'post',
  url: 'https://maskinporten.no/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: data
};

// POST request - https://maskinporten.no/token
axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data.access_token));

  })
  .catch(function (error) {
    console.log(error.response.data);
  });