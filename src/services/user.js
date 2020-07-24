import bcrypt from "bcryptjs";
import { Protectora, Profesional, Particular } from "../models/user";
import jwt from "jsonwebtoken";
import removeNullProperties from "../../helpers/removeNullProperties";

class UserService {
  constructor() {}

  async getUser(id) {
    const model = await this.getUserModelById(id);
    const user = await model.findOne({ _id: id });

    return this.prettifyUser(user, true);
  }

  async login(email, password) {
    const user = await this.getUserByEmail(email);
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
  }

  async createUser(data) {
    if (await this.isEmailAlreadyInUse(data.email)) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;

    const model = await this.getUserModelByType(data.type);
    const user = await new model(data).save();

    return user;
  }

  async updateUser(userId, newData) {
    if (newData.email && (await this.isEmailAlreadyInUse(newData.email))) {
      throw new Error("Email already in use");
    }

    const model = await this.getUserModelById(userId);
    const updatedUser = await model.findByIdAndUpdate(userId, newData, {
      new: true,
    });

    return updatedUser;
  }

  async isEmailAlreadyInUse(email) {
    let user = await Protectora.findOne({ email: email });
    if (user) {
      return true;
    }

    user = await Profesional.findOne({ email: email });
    if (user) {
      return true;
    }

    user = await Particular.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  }

  async getUserModelById(id) {
    let user = await Protectora.findOne({ _id: id });
    if (user) {
      return Protectora;
    }

    user = await Profesional.findOne({ _id: id });
    if (user) {
      return Profesional;
    }

    user = await Particular.findOne({ _id: id });
    if (user) {
      return Particular;
    }

    throw new Error("User does not exists");
  }

  async getUserModelByType(type) {
    switch (type) {
      case "PROTECTORA":
        return Protectora;
      case "PROFESIONAL":
        return Profesional;
      case "PARTICULAR":
        return Particular;
      default:
        throw new Error("Invalid type");
    }
  }

  async getUserByEmail(email) {
    let user = await Protectora.findOne({ email: email });
    if (user) {
      return user;
    }

    user = await Profesional.findOne({ email: email });
    if (user) {
      return user;
    }

    user = await Particular.findOne({ email: email });
    if (user) {
      return user;
    }
    return undefined;
  }

  prettifyUser(user, removePassword) {
    if (removePassword) {
      user.password = undefined;
    }
    user = removeNullProperties(user);
    console.log(user);
    return user;
  }
}

export default new UserService();
