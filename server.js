const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const userSchema = require("./schemas/schema");
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require("axios");
const server = express();

const shouldParseRequest = (req) => {
    console.log(!req.url.includes('graphql'))
    return !req.url.includes('graphql')
}

var parseJSON = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// server.use((req, res, next) => shouldParseRequest(req) ? parseJSON(req, res, next) : next())

server.use("/graphql", cors(), graphqlHTTP({
    graphiql: true,
    schema: userSchema
}))

server.post('/auth', urlencodedParser, function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.status(400).send("Credentials are required")
    } else {
        axios.get(`http://localhost:3000/users?email=${email}`).then(response => {
            // no hash because it's just for frontend test this API
            let user =response.data[0];
            if (user.password === password) {
                res.status(200).send(user);
            } else {
                res.status(403).send("invalid credentials");
            }
        })
    }
});


server.listen(4000, () => {
    console.log("Serveur en écoute sur le port 4000");
})