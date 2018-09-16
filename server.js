const express = require('express'); 
const expressGraphQL = require('express-graphql'); 


const server = express(); 
server.use('/graphql', expressGraphQL({
    graphiql: true //only used in development environment for graphiQL
}))

server.listen(4000, () => {
    console.log('Listening on PORT 4000')
}); 