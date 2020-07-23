import "../config/database";
import app from "../config/server";
import express from "express";

// MongoDB Models
import Ad from "./models/Ad";
import { Profesionales, Protectoras, Particulares } from "./models/User";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Routes
app.use(
  "/graphql",
  express.json(),
  graphqlExpress({
    schema,
    context: { Protectoras, Profesionales, Particulares },
  })
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
  })
);

// Settings
app.set("port", process.env.PORT || 3030);

app.listen(app.get("port"), () => {
  console.log("Server running");
});
