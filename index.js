const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {GraphQLObjectType,GraphQLString,GraphQLInt,GraphQLNonNull} = require('graphql')

const WebsiteType = new GraphQLObjectType({
    name:"Website",
    description:"Represents website made by an owner",
    fields: () =>({
        id: { type: GraphQLNonNull(GraphQLInt)}
    })
})


const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/graphql', graphqlHTTP({
    schema: executableSchema,
    context: data,
    graphiql: true,
}),
);

app.listen(4000);