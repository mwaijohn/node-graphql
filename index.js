const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList, GraphQLSchema } = require('graphql');
const cors = require('cors')

const { request, gql, GraphQLClient } = require('graphql-request');



const WebsiteType = new GraphQLObjectType({
    name: "Website",
    description: "Represents website made by an owner",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
    })
})

const ownerType = new GraphQLObjectType({
    name: "Owner",
    description: "Represents owner",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    })
})

var Owners = [
    { id: 1, name: "Vinicius Junior" },
    { id: 2, name: "Eden Hazard" },
    { id: 3, name: "Lionel Messi" }
]
var Websites = [
    { id: 1, name: "RealMadrid.com", ownerId: 1 },
    { id: 2, name: "brazil.com", ownerId: 1 },
    { id: 3, name: "BELGIUM.com", ownerId: 2 },
    { id: 4, name: "psg.com", ownerId: 3 },
    { id: 5, name: "argentina.com", ownerId: 3 }
]


const rootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        websites: {
            type: new GraphQLList(WebsiteType),
            description: "List of all transactions",
            resolve: () => Websites
        },
        owners: {
            type: new GraphQLList(ownerType),
            description: "List of all owners",
            resolve: () => Owners
        },
        website: {
            type: WebsiteType,
            description: "A single website",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => Websites.find(website => website.id == args.id)
        },
        owner: {
            type: WebsiteType,
            description: "A single owner",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => Owners.find(owner => owner.id == args.id)
        },
    })
})


const rootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addWebsite: {
            type: WebsiteType,
            description: "Add new website",
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const website = { id: Websites.length + 1, name: args.name, ownerId: args.ownerId }
                Websites.push(website)
                return website
            }
        },
        updateWebsite: {
            type: WebsiteType,
            description: "Update website",
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                Websites[args.id - 1].name = args.name
                Websites[args.id - 1].ownerId = args.ownerId
                return Websites[args.id - 1]
            }
        },
        removeWebsite: {
            type: WebsiteType,
            description: "Remove website",
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                Websites.filter(website => website.id != args.id)
                return Websites[args.id]
            }
        },
    })
})

schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType
})

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/graphql', graphqlHTTP({
    schema: schema,
    // context: data,
    graphiql: true,
}),
);

app.get("/", async (request, response) => {
    const graphQLClient = new GraphQLClient('http://localhost:4000/graphql');
    const query = gql`
    {
        websites{
          name
          id
        }
    }`;
    const results = await graphQLClient.request(query);

    return response.send(results)

});

app.listen(4000);