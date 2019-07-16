const express = require('express');
const graphqlHTTP = require('express-graphql')
const app = express();
const schema = require('./schemas/schema')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/graph-ql', { useNewUrlParser: true })
mongoose.connection.once('open', ()=>{
    console.log("connected to database");
});
app.use('/graphapi', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(3000, ()=>{
    console.log("The server is running on port 3000")
});