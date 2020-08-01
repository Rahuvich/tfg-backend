import bcrypt from "bcryptjs";
import { Protectora, Profesional, Particular } from "../models/user";
import jwt from "jsonwebtoken";

class UserService {
  constructor() {}

  async getUser(id, prettify = false) {
    const model = await this.getUserModelById(id);
    const user = await model.findById(id);
    return prettify
      ? await user.populate("valuations.author").execPopulate()
      : user;
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
      user: await this.populateValuations(user.id),
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

    return await this.populateValuations(updatedUser.id);
  }

  async valuateUser(userId, data) {
    if (userId === data.userId) {
      throw new Error("You can not valuate yourself");
    }

    const userValuator = await this.getUser(userId);
    const userValuated = await this.getUser(data.userId);

    const newData = {
      ...data,
      author: userValuator,
      fromModel: userValuator.constructor.modelName,
    };

    if (await this.isUserAlreadyValuatedById(data.userId, userId)) {
      userValuated.valuations = userValuated.valuations.map((valuation) => {
        if (valuation.author.toString() === userId.toString()) {
          return newData;
        } else return valuation;
      });
    } else {
      userValuated.valuations.push(newData);
    }

    await userValuated.save();

    return await this.populateValuations(userValuated.id);
  }

  async removeValuation(userIdValuator, userIdValuated) {
    const userValuated = await this.getUser(userIdValuated);

    userValuated.valuations = userValuated.valuations.filter(
      (valuation) => valuation.author.toString() !== userIdValuator.toString()
    );

    await userValuated.save();

    return await this.populateValuations(userValuated.id);
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
    return null;
  }

  async getUserModelById(id) {
    if (await this.isProtectora(id)) {
      return Protectora;
    }

    if (await this.isProfesional(id)) {
      return Profesional;
    }

    if (await this.isParticular(id)) {
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

  async isEmailAlreadyInUse(email) {
    let user = await this.getUserByEmail(email);

    if (user) {
      return true;
    }
    return false;
  }

  async isUserAlreadyValuatedById(userValuatedId, userValuatorId) {
    const userValuated = await this.getUser(userValuatedId);
    return userValuated.valuations.some((valuation) => {
      return valuation.author.toString() === userValuatorId.toString();
    });
  }

  async isProtectora(id) {
    const user = await Protectora.findById(id);
    if (user) {
      return true;
    }
    return false;
  }

  async isProfesional(id) {
    const user = await Profesional.findById(id);
    if (user) {
      return true;
    }
    return false;
  }

  async isParticular(id) {
    const user = await Particular.findById(id);
    if (user) {
      return true;
    }
    return false;
  }

  // TODO Automatize this with Mongoose API
  async populateValuations(userId) {
    let user = await this.getUser(userId);
    for (let i = 0; i < user.valuations.length; ++i) {
      let id = user.valuations[i].author;
      user.valuations[i].author = await this.getUser(id);
    }
    return user;
  }
}

export default new UserService();
