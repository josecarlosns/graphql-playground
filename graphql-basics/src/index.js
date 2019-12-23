import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }

    type User {
      id: ID!
      name: String!
      email: String
      age: Int!
    }
`;

const resolvers = {
  Query: {
    id() {
      return 'asdf123';
    },
    name() {
      return 'mary sue';
    },
    age() {
      return 32;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Server started');
});
