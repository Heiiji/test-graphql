const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const userSchema = require("./schemas/schema");
const cors = require("cors");
const server = express();

server.use("/graphql", cors(), graphqlHTTP({
    graphiql: true,
    schema: userSchema
}))

server.listen(4000, () => {
    console.log("Serveur en écoute sur le port 4000");
})