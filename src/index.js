import "../config/database";
import app from "../config/server";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { graphiqlExpress } from "graphql-server-express";

import { typeDef as userTypes } from "./graphql/schema/user";
import { typeDef as adTypes } from "./graphql/schema/ad";
import { typeDef as paginationTypes } from "./graphql/schema/pagination";
import { typeDef as chatTypes } from "./graphql/schema/chat";
import typeDefs from "./graphql/schema/schema";

import graphQlResolvers from "./graphql/resolvers/resolvers";
import { makeExecutableSchema } from "graphql-tools";
import isAuth from "../middleware/is_auth";
import { PubSub } from "graphql-subscriptions";

// * Subscriptions
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

const pubsub = new PubSub();

app.use(express.json());

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, adTypes, userTypes, paginationTypes, chatTypes],
  resolvers: graphQlResolvers,
});

app.use(isAuth);

// Routes
app.use(
  "/graphql",
  graphqlHTTP((req, res, params) => ({
    schema: schema,
    graphiql: true,
    context: {
      ...req,
      pubsub,
    },
  }))
);

// Settings
app.set("port", process.env.PORT || 3030);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: `ws://localhost:${app.get("port")}/subs`,
  })
);

const server = createServer(app);
server.listen(app.get("port"), () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: "/subs",
    }
  );
  console.log(`Server running on port ${app.get("port")}`);
});
