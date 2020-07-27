import { dateToString } from "../../helpers/date";
import { AnimalAd, ProductAd, ServiceAd } from "../models/ad";
import UserService from "./user";
import removeNullProperties from "../../helpers/removeNullProperties";

class AdService {
  constructor() {}

  async deleteAnimalAd(id) {
    return await AnimalAd.findByIdAndDelete(id).populate("creator");
  }

  async isUserCreatorOfAd(userId, adId) {
    const ad = await AnimalAd.findById(adId);
    if (!ad) {
      throw new Error("Ad does not exist");
    }
    return ad.creator.toString() === userId;
  }

  async updateAnimalAd(adInput) {
    const data = { ...adInput };

    const ad = await AnimalAd.findByIdAndUpdate(data._id, data, {
      new: true,
    }).populate("creator");

    if (data.type === "DOG") {
      if (!("size" in data)) {
        throw new Error("Dogs ads must specify size field");
      }
    } else {
      if ("size" in ad) {
        ad.size = undefined;
        await ad.save();
      }
    }

    return ad;
  }

  async getAnimalAd(id) {
    return await AnimalAd.findById(id).populate("creator");
  }

  async createAnimalAd(userId, adInput) {
    const user = await UserService.getUser(userId);
    if (
      !(await UserService.isProtectora(userId)) &&
      !(await UserService.isParticular(userId))
    ) {
      throw new Error("Profesionals can not create an animal ad");
    }

    const data = { ...adInput };

    if (data.type === "DOG") {
      if (!("size" in data)) {
        throw new Error("Dogs ads must specify size field");
      }
    } else {
      if ("size" in data) {
        delete data.size;
      }
    }

    data.creator = user;
    data.fromModel = user.constructor.modelName;

    const ad = await new AnimalAd(data).save();
    return ad;
  }
}

export default new AdService();
