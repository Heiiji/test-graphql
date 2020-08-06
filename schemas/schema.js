const graphQL = require("graphql");
const axios = require("axios")
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphQL;

// passer en fonction fleché permet de resoudre les problemes de dependance car la fonction s'execute apres la compilation et donc UserType est defini

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLInt },
        rooms: {
            type: GraphQLList(RoomType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${parentValue.id}/rooms`).then(response => {
                    return response.data;
                })
            }
        }
    })
})

const RoomType = new GraphQLObjectType({
    name: "Room",
    fields: {
        id: { type: GraphQLString },
        location: { type: GraphQLString },
        size: { type: GraphQLInt },
        description: { type: GraphQLString },
        date: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${parentValue.userId}`).then(response => {
                    return response.data;
                })
            }
        }
    }
})

const MutationType = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addRoom: {
            type: RoomType,
            args: {
                location: { type: GraphQLNonNull(GraphQLString) },
                size: { type: GraphQLNonNull(GraphQLInt) },
                description: { type: GraphQLString },
                userId: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.post(`http://localhost:3000/rooms`, {
                    location: args.location,
                    size: args.size,
                    description: args.description,
                    userId: args.userId,
                    Date: new Date()
                }).then(response => {
                    return response.data;
                })
            }
        },
        deleteRoom: {
            type: RoomType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args) {
                return axios.delete(`http://localhost:3000/rooms/${args.id}`).then(response => {
                    return response.data;
                })
            }
        }
    }
})


const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(response => {
                    return response.data;
                })
            }
        },
        users: {
            type: GraphQLList(UserType),
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users`).then(response => {
                    return response.data;
                })
            }
        },
        room: {
            type: RoomType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/rooms/${args.id}`).then(response => {
                    return response.data;
                })
            }
        },
        rooms: {
            type: GraphQLList(RoomType),
            args: {},
            resolve() {
                return axios.get(`http://localhost:3000/rooms`).then(response => {
                    return response.data;
                })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
})