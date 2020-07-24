// * Import resolvers
import userResolver from "./user";
import typesResolver from "./types";

const rootResolver = {
  ...userResolver,
  ...typesResolver,
};

module.exports = rootResolver;
