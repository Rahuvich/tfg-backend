import bcrypt from "bcryptjs";
import { dateToString } from "../../../helpers/date";
import jwt from "jsonwebtoken";
import { Profesional, Protectora, Particular } from "../../models/user";
import UserService from "../../services/user";

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
    getUser: async (_, { id }) => {
      try {
        return await UserService.getUser(id);
      } catch (err) {
        throw err;
      }
    },
    getAllProtectoras: async (_, args) => {
      const protectoras = await Protectora.find();
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
