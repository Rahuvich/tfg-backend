import { withFilter } from "apollo-server";
import ChatService from "../../services/chat";

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

        await req.pubsub.publish(CREATE_MESSAGE, msg);

        return msg;
      } catch (err) {
        throw err;
      }
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_, args, req) => req.pubsub.asyncIterator(CREATE_MESSAGE),
        async (result, { roomId }, req, info) => {
          if (!req.isAuth) {
            throw new Error("You must be logged in");
          }
          try {
            return await ChatService.isUserRoom(req.userId, roomId);
          } catch (err) {
            throw err;
          }
        }
      ),
      resolve: (result, args, context, info) => {
        return result;
      },
    },
  },
};
