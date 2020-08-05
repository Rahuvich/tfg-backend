import { withFilter } from "apollo-server";
import ChatService from "../../services/chat";
import util from "util";

const CREATE_MESSAGE = "CREATE_MESSAGE";

module.exports = {
  Query: {
    myRooms: async (_, args, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await ChatService.getUserRooms(req.userId);
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    createMessage: async (_, { toUser, text, ad }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        const msg = await ChatService.createMessage(
          req.userId,
          toUser,
          text,
          ad
        );

        console.log(util.inspect(msg, false, true, true));
        await req.pubsub.publish(CREATE_MESSAGE, msg);

        return msg;
      } catch (err) {
        throw err;
      }
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_, args, req) => req.pubsub.asyncIterator(CREATE_MESSAGE),
      /* subscribe: withFilter(
        (_, args, req) => req.pubsub.asyncIterator(CREATE_MESSAGE),
        (result, args, context, info) => true
      ), */
      resolve: (result, args, context, info) => {
        console.log(result);
        return result;
      },
    },
  },
};
