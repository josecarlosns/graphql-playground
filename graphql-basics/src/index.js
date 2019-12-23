import { GraphQLServer } from 'graphql-yoga';

const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@email.com',
    age: 22
  },
  {
    id: '2',
    name: 'Mary Sue',
    email: 'marysue@email.com',
    age: 31
  },
  {
    id: '3',
    name: 'Mike Sho',
    age: 21
  }
];

const posts = [
  {
    id: 12,
    title: 'so theory',
    body: "I'm hungry",
    published: true,
    author: '1'
  },
  {
    id: 13,
    title: 'marketing',
    body: 'who are you?',
    published: false,
    author: '1'
  },
  {
    id: 15,
    title: 'publishing',
    body: 'bcuz of course',
    published: false,
    author: '3'
  }
];

const typeDefs = `
    type Query {
      me: User!
      post: Post!
      users(query: String): [User!]!
      posts: [Post!]!
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
      author: User!
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
        published: false,
        author: '2'
      };
    },
    users(parent, args, context, info) {
      if (args.query)
        return users.filter(user =>
          user.name.toLowerCase().includes(args.query.toLowerCase())
        );

      return users;
    },
    posts(parent, args, context, info) {
      return posts;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
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
