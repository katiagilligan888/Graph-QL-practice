//schema file communicates all the different types of data in our application
//over to graphQL, and also tells graphQL how they are all related.

const graphql = require('graphql');
const axios = require('axios'); 

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema
} = graphql;

const CompanyType = new GraphQLObjectType({
    name:'Company', 
    fields: {
        id: { type: GraphQLString }, 
        name: { type: GraphQLString }, 
        description: { type: GraphQLString }
    }
})


const UserType = new GraphQLObjectType({
    name: 'User', 
    fields: { // all the properties that a user has and what type of data type
        id: { type: GraphQLString } ,
        firstName: { type: GraphQLString } , 
        age: { type: GraphQLInt }, 
        company: {
            type: CompanyType, 
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(
                    res => res.data
                )
            }
        }
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
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data)
            }
        }
    }
}); 

//Graph QL Schema

module.exports = new GraphQLSchema({
    query: RootQuery
}); 

