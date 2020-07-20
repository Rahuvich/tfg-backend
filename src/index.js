import express from "express";
const app = express();

import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost/tfg")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// MongoDB Models
import Ad from "./models/Ad";
import { Profesionales, Protectoras, Particulares } from "./models/User";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./schema";
import resolvers from "./resolvers";

// Settings
app.set("port", process.env.PORT || 3030);

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

app.listen(app.get("port"), () => {
  console.log("Server running");
});
