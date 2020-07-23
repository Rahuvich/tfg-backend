import bcrypt from "bcryptjs";
import { dateToString } from "../../../helpers/date";
import jwt from "jsonwebtoken";
import { Profesionales, Protectoras, Particulares } from "../../models/User";

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
      const user = await Particulares.findOne({ email: email });
      if (!user) {
        throw new Error("Invalid email");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        "someSuperSecretKey",
        {
          expiresIn: "1h",
        }
      );
      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
      };
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
    createUser: async (_, { userInput }) => {
      try {
        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        let user;
        switch (userInput.type) {
          case "PROTECTORA":
            user = await Protectoras.findOne({ email: userInput.email });
            if (user) {
              throw new Error("Email already in use");
            }

            user = await new Protectoras({
              email: userInput.email,
              name: userInput.name,
              phone: userInput.phone,
              address: userInput.address,
              password: hashedPassword,
            }).save();
            break;
          case "PROFESIONAL":
            user = await Profesionales.findOne({ email: userInput.email });
            if (user) {
              throw new Error("Email already in use");
            }

            user = await new Profesionales({
              email: userInput.email,
              name: userInput.name,
              phone: userInput.phone,
              address: userInput.address,
              password: hashedPassword,
            }).save();
            break;
          case "PARTICULAR":
            user = await Particulares.findOne({ email: userInput.email });
            if (user) {
              throw new Error("Email already in use");
            }

            user = await new Particulares({
              email: userInput.email,
              name: userInput.name,
              phone: userInput.phone,
              address: userInput.address,
              password: hashedPassword,
            }).save();
            break;
          default:
            throw new Error("Invalid type");
        }

        user._id = user._id.toString();
        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};
