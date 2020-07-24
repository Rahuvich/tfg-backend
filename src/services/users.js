import bcrypt from "bcryptjs";
import { Protectoras, Profesionales, Particulares } from "../models/User";
import jwt from "jsonwebtoken";
import removeNullProperties from "../../helpers/removeNullProperties";

class UserService {
  constructor() {}

  async getProtectora(id) {
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
    let user = await Protectoras.findOne({ email: email });
    if (user) {
      return true;
    }

    user = await Profesionales.findOne({ email: email });
    if (user) {
      return true;
    }

    user = await Particulares.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  }

  async getUserModelById(id) {
    let user = await Protectoras.findOne({ _id: id });
    if (user) {
      return Protectoras;
    }

    user = await Profesionales.findOne({ _id: id });
    if (user) {
      return Profesionales;
    }

    user = await Particulares.findOne({ _id: id });
    if (user) {
      return Particulares;
    }

    throw new Error("User does not exists");
  }

  async getUserModelByType(type) {
    switch (type) {
      case "PROTECTORA":
        return Protectoras;
      case "PROFESIONAL":
        return Profesionales;
      case "PARTICULAR":
        return Particulares;
      default:
        throw new Error("Invalid type");
    }
  }

  async getUserByEmail(email) {
    let user = await Protectoras.findOne({ email: email });
    if (user) {
      return user;
    }

    user = await Profesionales.findOne({ email: email });
    if (user) {
      return user;
    }

    user = await Particulares.findOne({ email: email });
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
