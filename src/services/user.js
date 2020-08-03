import bcrypt from "bcryptjs";
import { Protectora, Profesional, Particular, SavedAds } from "../models/user";
import jwt from "jsonwebtoken";
import AdService from "./ad";
import mongoose from "mongoose";

class UserService {
  constructor() {}

  async saveAd(userId, adId) {
    const user = await this.getUser(userId);
    const ad = await AdService.getAd(adId);

    if (!user || !ad) {
      throw new Error("User or ad does not exist");
    }

    const data = {
      user: user,
      userFromModel: user.constructor.modelName,
      ad: ad,
      adFromModel: ad.constructor.modelName,
    };

    await new SavedAds(data).save();

    const list = await SavedAds.find({ user: user.id }).populate("ad");

    return list.map(
      async (document) => await document.ad.populate("creator").execPopulate()
    );
  }

  async unsaveAd(userId, adId) {
    await SavedAds.findOneAndDelete({
      user: userId,
      ad: adId,
    });

    const list = await SavedAds.find({ user: userId }).populate("ad");

    return list.map(
      async (document) => await document.ad.populate("creator").execPopulate()
    );
  }

  async getUser(id, prettify = false) {
    const model = await this.getUserModelById(id);
    const user = await model.findById(id);
    return prettify ? await this.populate(user) : user;
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
      user: await this.populate(user),
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

    return await this.populate(updatedUser);
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

    return await this.populate(userValuated);
  }

  async removeValuation(userIdValuator, userIdValuated) {
    const userValuated = await this.getUser(userIdValuated);

    userValuated.valuations = userValuated.valuations.filter(
      (valuation) => valuation.author.toString() !== userIdValuator.toString()
    );

    await userValuated.save();

    return await this.populate(userValuated);
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

  async populate(user) {
    await user.populate("valuations.author").execPopulate();
    return user;
  }
}

export default new UserService();
