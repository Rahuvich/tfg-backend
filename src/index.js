import "../config/database";
import app from "../config/server";
import express from "express";

import { graphqlHTTP } from "express-graphql";
import graphQlSchema from "./graphql/schema/schema";
import graphQlResolvers from "./graphql/resolvers/resolvers";

app.use(express.json());

// Routes
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    resolvers: graphQlResolvers,
    graphiql: true,
  })
);

// Settings
app.set("port", process.env.PORT || 3030);

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});
