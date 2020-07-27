import bcrypt from "bcryptjs";
import { dateToString } from "../../helpers/date";
import { Protectora, Profesional, Particular } from "../models/user";
import jwt from "jsonwebtoken";
import removeNullProperties from "../../helpers/removeNullProperties";

class UserService {
  constructor() {}

  async getUser(id) {
    const model = await this.getUserModelById(id);
    const user = await model.findById(id);

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
      user: this.prettifyUser(user, true),
      token: token,
      tokenExpiration: 1,
    };
  }

  async createUser(data) {
    if (await this.isEmailAlreadyInUse(data.email)) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newData = {
      ...data,
      password: hashedPassword,
    };

    const model = await this.getUserModelByType(newData.type);
    await new model(newData).save();

    return await this.login(data.email, data.password);
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
    return user;
  }
}

export default new UserService();
