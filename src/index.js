import "../config/database";
import express from "express";

import { typeDef as userTypes } from "./graphql/schema/user";
import { typeDef as adTypes } from "./graphql/schema/ad";
import { typeDef as paginationTypes } from "./graphql/schema/pagination";
import { typeDef as chatTypes } from "./graphql/schema/chat";
import typeDefs from "./graphql/schema/schema";

import graphQlResolvers from "./graphql/resolvers/resolvers";
import { makeExecutableSchema } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import { HttpAuth, WebSocketAuth } from "../middleware/is_auth";
import { PubSub } from "apollo-server";

// * Subscriptions
import { createServer } from "http";

const app = express();
const PORT = process.env.PORT || 3030;

const pubsub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, adTypes, userTypes, paginationTypes, chatTypes],
  resolvers: graphQlResolvers,
});

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      return { ...connection.context, pubsub };
    } else {
      return { ...req, pubsub };
    }
  },
  subscriptions: {
    onConnect: WebSocketAuth,
    keepAlive: 10,
  },
});

app.use(HttpAuth);

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
/* 
import { fillDB } from "../helpers/fill_db";
try {
  fillDB();
} catch (err) {} */
