// * Import resolvers
import userResolver from "./user";
import adResolver from "./ad";
import chatResolver from "./chat";
import { merge } from "lodash";

const rootResolver = merge(userResolver, adResolver, chatResolver);

module.exports = rootResolver;
