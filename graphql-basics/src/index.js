import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
      greeting(name: String): String!
      me: User!
      post: Post!
      grades: [Float!]!
      add(numbers: [Float!]!): Float!
    }

    type User {
      id: ID!
      name: String!
      email: String
      age: Int!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean
    }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: 'asdf123',
        name: 'John Doe',
        email: 'johndoe@email.com',
        age: 32
      };
    },
    post() {
      return {
        id: '321fdsa',
        title: 'Casa engraçada',
        body: 'Uma casa muito engraçada',
        ṕublished: false
      };
    },
    greeting(_, args) {
      if (args.name) return `Hello ${args.name}!`;

      return 'Hello!';
    },
    grades() {
      return [9.9, 1.2, 10];
    },
    add(parent, args, ctx, info) {
      return args.numbers.reduce((acc, val) => acc + val);
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
