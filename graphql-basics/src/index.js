import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Subscription
} from './resolvers';

const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Subscription
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log('Server started');
});
