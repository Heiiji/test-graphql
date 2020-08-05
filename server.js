const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const userSchema = require("./schemas/schema");
const server = express();

server.use("/graphql", graphqlHTTP({
    graphiql: true,
    schema: userSchema
}))

server.listen(4000, () => {
    console.log("Serveur en écoute sur le port 4000");
})