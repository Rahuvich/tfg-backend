import bcrypt from "bcryptjs";
import { Protectora, Profesional, Particular, SavedAds } from "../models/user";
import jwt from "jsonwebtoken";
import AdService from "./ad";
import { Client, Status } from "@googlemaps/google-maps-services-js";
import CloudinaryService from "./cloudinary";

class UserService {
  constructor() {
    this.mapService = new Client({});
  }

  async getCloseShelters(fromAddress) {
    const shelters = (await Protectora.find()).filter(
      (shelter) => "address" in shelter
    );

    const result = await this.mapService.distancematrix({
      params: {
        origins: [fromAddress],
        destinations: shelters.map((protectora) => protectora.address),
        key: process.env.GOOGLE_API_KEY,
      },
    });

    var distanceData = [];

    if (result.data.status === "OK") {
      for (var i = 0; i < result.data.rows.length; i++) {
        for (var j = 0; j < result.data.rows[i].elements.length; j++) {
          if (result.data.rows[i].elements[j].status === "OK") {
            distanceData.push({
              protectora: await shelters[i + j]
                .populate("valuations.author")
                .execPopulate(),
              distance: result.data.rows[i].elements[j].distance.value,
              travelTime: result.data.rows[i].elements[j].duration.value,
            });
          } /* else {
            shelters.splice(i + j, 1);
          } */
        }
      }
    } else {
      throw new Error("Error thrown by Google API");
    }

    return distanceData.sort((a, b) => a.travelTime - b.travelTime);
  }

  async getSavedAds(userId) {
    const list = await SavedAds.find({ user: userId }).populate("ad");

    return list.map(async (document) => {
      await document.ad.populate("creator").execPopulate();
      await document.ad.creator.populate("valuations.author").execPopulate();
      return document.ad;
    });
  }

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

    return await this.getSavedAds(user.id);
  }

  async unsaveAd(userId, adId) {
    await SavedAds.findOneAndDelete({
      user: userId,
      ad: adId,
    });

    return await this.getSavedAds(userId);
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

    const newData = {
      ...data,
      password: await bcrypt.hash(data.password, 12),
      thumbnail: await CloudinaryService.uploadUserImage(
        data.thumbnail,
        data.email
      ),
    };

    const model = await this.getUserModelByType(newData.type);
    await new model(newData).save();

    return await this.login(data.email, data.password);
  }

  async updateUser(userId, newData) {
    // Remove null properties
    Object.keys(newData).forEach(
      (key) => newData[key] == null && delete newData[key]
    );

    if (newData.email && (await this.isEmailAlreadyInUse(newData.email))) {
      throw new Error("Email already in use");
    }

    if (newData.thumbnail) {
      const email = newData.email
        ? newData.email
        : (await this.getUser(userId)).email;
      newData.thumbnail = await CloudinaryService.uploadUserImage(
        newData.thumbnail,
        email
      );
    }

    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 12);
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

  async delete(id) {
    const model = await this.getUserModelById(id);
    return await model.findByIdAndDelete(id);
  }

  async populate(user) {
    await user.populate("valuations.author").execPopulate();
    return user;
  }
}

export default new UserService();
