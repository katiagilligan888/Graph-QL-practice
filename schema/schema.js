//schema file communicates all the different types of data in our application
//over to graphQL, and also tells graphQL how they are all related.

const graphql = require('graphql');
const axios = require('axios'); 

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull
} = graphql;


const CompanyType = new GraphQLObjectType({
    name:'Company', 
    fields: () => ({ //arrow function will only execute after entire file has been executed, which at that point UserType will be defined.
        id: { type: GraphQLString }, 
        name: { type: GraphQLString }, 
        description: { type: GraphQLString }, 
        users: {
            type: GraphQLList(UserType), 
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data)
            }
        }
    })
})


const UserType = new GraphQLObjectType({
    name: 'User', 
    fields:() => ({ // all the properties that a user has and what type of data type
        id: { type: GraphQLString } ,
        firstName: { type: GraphQLString } , 
        age: { type: GraphQLInt }, 
        company: {
            type: CompanyType, 
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue .companyId}`).then(
                    res => res.data
                )
            }
        }
    })
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
        }, 
        company: {
            type: CompanyType, 
            args: { id: { type: GraphQLString }}, 
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data)
            }
        }
    }
}); 

// Root Mutation

const mutation = new GraphQLObjectType({
    name: 'Mutation', 
    fields: {
        addUser: {
            type: UserType,
            args: {
              firstName: {type: new GraphQLNonNull(GraphQLString)}, 
              age: {type: new GraphQLNonNull(GraphQLInt)}, 
              companyId: {type: GraphQLString}
            },
            resolve(parentValue, { firstName, age }){
                return axios.post("http://localhost:3000/users",{ firstName, age})
                .then(res => res.data)
            }
        }, 
        deleteUser: {
            type: UserType, 
            args: {
                id: {type: GraphQLString}
            }, 
            resolve(parentValue, { id }){
                return axios.delete(`http://localhost:3000/users/${id}`)
                .then(res => res.data)
            }
        }, 
        editUser: {
            type: UserType, 
            args: {
               id: {type: GraphQLString}, 
               age: {type: GraphQLInt}, 
               firstName: {type: GraphQLString}, 
               companyId: {type: GraphQLString}
            }, 
            resolve(parentValue, {id, age, firstName, companyId}){
                return axios.patch(`http://localhost:3000/users/${id}`, {age, firstName})
                .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery, 
    mutation
}); 

