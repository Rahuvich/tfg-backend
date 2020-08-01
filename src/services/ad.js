import { AnimalAd, ProductAd, ServiceAd } from "../models/ad";
import UserService from "./user";

class AdService {
  constructor() {}

  // * General

  async isUserCreatorOfAd(userId, adId) {
    let ad = await this.getAd(adId);
    if (!ad) {
      throw new Error("Ad does not exist");
    }
    return ad.creator.id.toString() === userId;
  }

  async getAdWithModel(id, model) {
    return await model.findById(id).populate("creator");
  }

  async getAd(id) {
    let ad = await this.getAdWithModel(id, AnimalAd);
    if (ad) {
      return ad;
    }
    ad = await this.getAdWithModel(id, ProductAd);
    if (ad) {
      return ad;
    }
    ad = await this.getAdWithModel(id, ServiceAd);
    if (ad) {
      return ad;
    }
    throw new Error("Ad does not exist");
  }

  // * Specific

  // Animal
  async deleteAnimalAd(id) {
    return await AnimalAd.findByIdAndDelete(id).populate("creator");
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

  // Product
  async createProductAd(userId, adInput) {
    const user = await UserService.getUser(userId);
    if (!(await UserService.isProfesional(userId))) {
      throw new Error("Only profesionals can not create a product ad");
    }

    const data = { ...adInput };

    data.creator = user;
    data.fromModel = user.constructor.modelName;

    const ad = await new ProductAd(data).save();
    return ad;
  }

  async updateProductAd(data) {
    const ad = await ProductAd.findByIdAndUpdate(data._id, data, {
      new: true,
    }).populate("creator");

    return ad;
  }

  async deleteProductAd(id) {
    return await ProductAd.findByIdAndDelete(id).populate("creator");
  }

  // Service
  async deleteServiceAd(id) {
    return await ServiceAd.findByIdAndDelete(id).populate("creator");
  }

  async updateServiceAd(data) {
    const ad = await ServiceAd.findByIdAndUpdate(data._id, data, {
      new: true,
    }).populate("creator");
    return ad;
  }

  async createServiceAd(userId, adInput) {
    const user = await UserService.getUser(userId);
    if (
      !(await UserService.isProfesional(userId)) &&
      !(await UserService.isParticular(userId))
    ) {
      throw new Error("Protectoras can not create a service ad");
    }

    const data = { ...adInput };

    data.creator = user;
    data.fromModel = user.constructor.modelName;

    const ad = await new ServiceAd(data).save();
    return ad;
  }
}

export default new AdService();
