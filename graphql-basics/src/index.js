import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';

let users = [
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

let posts = [
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

let comments = [
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
    post: '14',
    body: 'Of course what?'
  },
  {
    id: '21',
    author: '3',
    post: '14',
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
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!

      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!

      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int!
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      body: String!
      author: ID!
      post: ID!
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
      const emailTaken = users.some(user => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email already taken!');
      }

      const user = {
        id: uuid(),
        ...args.data
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userFound = users.find(user => user.id === args.id);

      if (!userFound) throw new Error('User not found!');

      users = users.filter(user => user.id !== args.id);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return userFound;
    },

    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) throw new Error('Author not found!');

      const newPost = {
        id: uuid(),
        ...args.data
      };

      posts.push(newPost);

      return newPost;
    },
    deletePost(parent, args, ctx, info) {
      const deletedPost = posts.find(post => post.id === args.id);

      if (!deletedPost) throw new Error('Post not found');

      posts = posts.filter(post => {
        const match = post.id === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      return deletedPost;
    },

    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(post => post.id === args.data.post);

      if (!userExists) throw new Error('Author not found!');

      if (!postExists) throw new Error('Post not found!');

      const newComment = {
        id: uuid(),
        ...args.data
      };

      return newComment;
    },
    deleteComment(parent, args, ctx, info) {
      const deletedComment = comments.find(comment => comment.id === args.id);

      if (!deletedComment) throw new Error('Comment not found');

      comments = comments.filter(comment => comment.id !== args.id);

      return deletedComment;
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
