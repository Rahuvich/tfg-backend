import { Profesional, Protectora, Particular } from "../../models/user";
import UserService from "../../services/user";
import CloudinaryService from "../../services/cloudinary";
import util from "util";
import { uploadTo, destroyTo } from "../../../helpers/image_uploader";
import { Console } from "console";

module.exports = {
  User: {
    __resolveType(data) {
      if (data instanceof Profesional) {
        return "Profesional";
      }
      if (data instanceof Particular) {
        return "Particular";
      }
      if (data instanceof Protectora) {
        return "Protectora";
      }
      return null;
    },
  },
  Particular: {
    thumbnail: async (obj, { options }, context, info) => {
      return obj.thumbnail;
      if (!str) return str;
      var parts = str.split("base/");
      return await CloudinaryService.getImage(
        `base/${parts[parts.length - 1]}`,
        options
      );
    },
  },
  Protectora: {
    thumbnail: async (obj, { options }, context, info) => {
      return obj.thumbnail;
      if (!str) return str;
      var parts = str.split("base/");
      return await CloudinaryService.getImage(
        `base/${parts[parts.length - 1]}`,
        options
      );
    },
  },
  Profesional: {
    thumbnail: async (obj, { options }, context, info) => {
      return obj.thumbnail;
      if (!str) return str;
      var parts = str.split("base/");
      return await CloudinaryService.getImage(
        `base/${parts[parts.length - 1]}`,
        options
      );
    },
  },

  Query: {
    getCloseShelters: async (_, { fromAddress }, req) => {
      if (!req.isAuth && !fromAddress) {
        throw new Error("You must be logged in");
      }
      try {
        if (!req.isAuth || fromAddress) {
          return await UserService.getCloseShelters(fromAddress);
        } else {
          const user = await UserService.getUser(req.userId);
          return await UserService.getCloseShelters(user.address);
        }
      } catch (err) {
        throw err;
      }
    },
    currentUser: async (_, context, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.getUser(req.userId);
      } catch (err) {
        throw err;
      }
    },
    savedAds: async (_, context, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.getSavedAds(req.userId);
      } catch (err) {
        throw err;
      }
    },
    login: async (_, { email, password }) => {
      try {
        return await UserService.login(email, password);
      } catch (err) {
        throw err;
      }
    },
    getUser: async (_, { id }) => {
      try {
        return await UserService.getUser(id, true);
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    saveAd: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.saveAd(req.userId, id);
      } catch (err) {
        throw err;
      }
    },
    unsaveAd: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.unsaveAd(req.userId, id);
      } catch (err) {
        throw err;
      }
    },
    valuateUser: async (_, { input }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.valuateUser(req.userId, input);
      } catch (err) {
        throw err;
      }
    },
    removeValuation: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }
      try {
        return await UserService.removeValuation(req.userId, id);
      } catch (err) {
        throw err;
      }
    },
    updateUser: async (_, { userInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }

      try {
        return await UserService.updateUser(req.userId, userInput);
      } catch (err) {
        throw err;
      }
    },
    createUser: async (_, { userInput }, req) => {
      try {
        return await UserService.createUser(userInput);
      } catch (err) {
        CloudinaryService.deleteUserImage(userInput.email);
        throw err;
      }
    },
  },
};
