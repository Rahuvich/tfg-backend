import bcrypt from "bcryptjs";
import { dateToString } from "../../../helpers/date";
import jwt from "jsonwebtoken";
import { Profesionales, Protectoras, Particulares } from "../../models/User";
import UserService from "../../services/users";

module.exports = {
  User: {
    __resolveType(data) {
      if (data instanceof Profesionales) {
        return "Profesional";
      }
      if (data instanceof Particulares) {
        return "Particular";
      }
      if (data instanceof Protectoras) {
        return "Protectora";
      }
      return null;
    },
  },

  Query: {
    helloWorld: () => {
      return "Hello world";
    },
    login: async (_, { email, password }) => {
      try {
        return await UserService.login(email, password);
      } catch (err) {
        throw err;
      }
    },
    getProtectora: async (_, { id }) => {
      try {
        return await UserService.getProtectora(id);
      } catch (err) {
        throw err;
      }
    },
    getAllProtectoras: async (_, args) => {
      const protectoras = await Protectoras.find();
      return protectoras.map((p) => {
        p._id = p._id.toString();
        return p;
      });
    },
  },

  Mutation: {
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
    createUser: async (_, { userInput }) => {
      try {
        return await UserService.createUser(userInput);
      } catch (err) {
        throw err;
      }
    },
  },
};
