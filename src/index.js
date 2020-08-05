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
import isAuth from "../middleware/is_auth";
import { PubSub } from "apollo-server";

// * Subscriptions
import { createServer } from "http";

const pubsub = new PubSub();
const app = express();
const PORT = process.env.PORT || 3030;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, adTypes, userTypes, paginationTypes, chatTypes],
  resolvers: graphQlResolvers,
});

/* const validateToken = (authToken) => {
  // ... validate token and return a Promise, rejects in case of an error
};

const findUser = (authToken) => {
  return (tokenValidationResult) => {
    // ... finds user by auth token and return a Promise, rejects in case of an error
  };
}; */

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      console.log("Websocket");
      return { ...connection.context, pubsub };
    } else {
      console.log("Http");
      return { ...req, pubsub };
    }
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      if (connectionParams.authToken) {
        return validateToken(connectionParams.authToken)
          .then(findUser(connectionParams.authToken))
          .then((user) => {
            return {
              currentUser: user,
            };
          });
      }

      throw new Error("Missing auth token!");
    },
  },
});

app.use(isAuth);

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
