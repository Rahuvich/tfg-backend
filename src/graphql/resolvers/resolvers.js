// * Import resolvers
import userResolver from "./user";
import adResolver from "./ad";
import chatResolver from "./chat";
import appResolver from "./app";
import { merge } from "lodash";

const rootResolver = merge(userResolver, adResolver, chatResolver,appResolver);

module.exports = rootResolver;
