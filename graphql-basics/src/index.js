import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

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
    id: '12',
    title: 'so theory',
    body: "I'm hungry",
    published: true,
    author: '1'
  },
  {
    id: '13',
    title: 'marketing',
    body: 'who are you?',
    published: false,
    author: '1'
  },
  {
    id: '14',
    title: 'publishing',
    body: 'bcuz of course',
    published: false,
    author: '3'
  }
];

const comments = [
  {
    id: '11',
    author: '1',
    post: '13',
    body: 'My name is methos'
  },
  {
    id: '22',
    author: '2',
    post: '13',
    body: "I'm Quelana of Izalith"
  },
  {
    id: '33',
    author: '2',
    post: '15',
    body: 'Of course what?'
  },
  {
    id: '21',
    author: '3',
    post: '15',
    body: 'Of course'
  }
];

const typeDefs = `
    type Query {
      me: User!
      post: Post!
      users(query: String): [User!]!
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
      createComment(body: String!, author: ID!, post: ID!): Comment!
    }

    type User {
      id: ID!
      name: String!
      email: String
      age: Int!
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean
      author: User!
      comments: [Comment!]!
    }

    type Comment {
      id: ID!
      author: User!
      post: Post!
      body: String!
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
    },
    comments() {
      return comments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.email);

      if (emailTaken) {
        throw new Error('Email already taken!');
      }

      const user = {
        id: uuid(),
        name: args.name,
        email: args.email,
        age: args.age
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);

      if (!userExists) throw new Error('Author not found!');

      const newPost = {
        id: uuid(),
        title: args.title,
        body: args.body,
        author: args.author,
        published: args.published
      };

      posts.push(newPost);

      return newPost;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);
      const postExists = posts.some(post => post.id === args.post);

      if (!userExists) throw new Error('Author does not exist!');

      if (!postExists) throw new Error('Post does not exist!');

      const newComment = {
        id: uuid(),
        body: args.body,
        author: args.author,
        post: args.post
      };

      return newComment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent) {
      return comments.filter(comment => parent.id === comment.post);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent) {
      return comments.filter(comment => parent.id === comment.author);
    }
  },
  Comment: {
    author(parent) {
      return users.find(user => user.id === parent.author);
    },
    post(parent) {
      return posts.find(post => post.id === parent.post);
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
