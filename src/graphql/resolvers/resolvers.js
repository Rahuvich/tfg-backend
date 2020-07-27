// * Import resolvers
import userResolver from "./user";
import adResolver from "./ad";
import { merge } from "lodash";

const rootResolver = merge(userResolver, adResolver);

module.exports = rootResolver;
