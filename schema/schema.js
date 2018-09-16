//schema file communicates all the different types of data in our application
//over to graphQL, and also tells graphQL how they are all related.

const graphql = require('graphql');
const _ = require('lodash'); 

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema
} = graphql;

const users = [
    {id:'23', firstName: 'Bill', age: 20}, 
    {id: '47', firstName: 'Samantha', age: 21}
]

const UserType = new GraphQLObjectType({
    name: 'User', 
    fields: { // all the properties that a user has and what type of data type
        id: { type: GraphQLString } ,
        firstName: { type: GraphQLString} , 
        age: {type: GraphQLInt}
    }
}); 

//ROOT Query: entry point into the application and data

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType', 
    fields: {
        user: {
            type: UserType, 
            args: { id: { type: GraphQLString }}, 
            resolve(parentValue, args){
                return _.find(users, {id: args.id})
            }
        }
    }
}); 

//Graph QL Schema

module.exports = new GraphQLSchema({
    query: RootQuery
}); 

