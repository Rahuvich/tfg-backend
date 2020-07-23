import "../config/database";
import app from "../config/server";
import express from "express";

import { graphqlHTTP } from "express-graphql";
import typeDefs from "./graphql/schema/schema";
import graphQlResolvers from "./graphql/resolvers/resolvers";
import { makeExecutableSchema } from "graphql-tools";
import isAuth from "../middleware/is_auth";

app.use(express.json());

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: graphQlResolvers,
});

app.use(isAuth);

// Routes
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Settings
app.set("port", process.env.PORT || 3030);

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});
