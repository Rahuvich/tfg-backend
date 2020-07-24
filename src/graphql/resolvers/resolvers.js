// * Import resolvers
import userResolver from "./user";

const rootResolver = {
  ...userResolver,
};

module.exports = rootResolver;
