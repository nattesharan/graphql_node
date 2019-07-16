const graphql = require('graphql')
const _ = require('lodash')
const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const Book = require('../models/book');
const Author = require('../models/author');
// var books = [
//     {id: '1', name: 'Test book 1', genre: 'Genre1', author_id: '3'},
//     {id: '2', name: 'Test book 2', genre: 'Genre2', author_id: '2'},
//     {id: '3', name: 'Test book 3', genre: 'Genre3', author_id: '1'}
// ]

// var authors = [
//     {id:'1', name: 'Author1', age: 45},
//     {id: '2', name: 'Author2', age: 43},
//     {id: '3', name: 'Author3', age:32}
// ]
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.author_id)
                // return _.find(authors, {id: parent.author_id})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({author_id: parent.id})
                // return _.filter(books, {author_id: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                return Book.findById(args.id)
                // return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id)
                // return _.find(authors, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find();
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'MutationQuery',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                author_id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    author_id: args.author_id
                });
                return book.save()
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});