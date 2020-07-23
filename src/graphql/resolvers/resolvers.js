// * Import resolvers
import userResolver from "./users";
import typesResolver from "./types";

const rootResolver = {
  ...userResolver,
  ...typesResolver,
};

module.exports = rootResolver;
