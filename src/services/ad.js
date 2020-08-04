import { AnimalAd, ProductAd, ServiceAd } from "../models/ad";
import UserService from "./user";
import PaginationService from "./pagination";
import { escapeRegex } from "../../helpers/regex";

class AdService {
  constructor() {}

  // * General

  async getAds(first, after) {
    const adList = await AnimalAd.find().sort({ createdAt: "desc" });
    const allEdges = adList.map((ad) => {
      return {
        node: ad,
        cursor: Buffer.from(ad.id.toString()).toString("base64"),
      };
    });

    const edges = PaginationService.edgesToReturn(
      allEdges,
      null,
      after,
      first,
      null
    );

    return {
      edges: edges,
      totalCount: edges.length,
      pageInfo: {
        hasNextPage: PaginationService.hasNextPage(
          allEdges,
          null,
          after,
          first,
          null
        ),
        hasPreviousPage: PaginationService.hasPreviousPage(
          allEdges,
          null,
          after,
          first,
          null
        ),
        startCursor: edges[0].cursor,
        endCursor: edges[edges.length - 1].cursor,
      },
    };
  }

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

  async findFromAllModels(args) {
    const animalList = await AnimalAd.find(args);
    const productList = await ProductAd.find(args);
    const serviceList = await ServiceAd.find(args);

    return animalList.concat(productList).concat(serviceList);
  }

  async searchAds(filters) {
    let query = {
      $and: [],
    };

    let obj;

    for (const prop in filters) {
      if (filters[prop] instanceof Array) {
        obj = {
          tags: { $in: [] },
        };

        for (let i = 0; i < filters[prop].length; ++i) {
          const regex = new RegExp(escapeRegex(filters[prop][i]), "i");
          obj.tags.$in.push(regex);
        }
      } else if (typeof filters[prop] === "boolean") {
        obj = {};
        obj[prop] = filters[prop];
      } else {
        let regex = filters[prop];
        if (prop !== "creator") {
          regex = new RegExp(escapeRegex(filters[prop]), "i");
        }

        obj = {};
        obj[prop] = regex;
      }
      query.$and.push(obj);
    }

    const list = await this.findFromAllModels(query);
    return list.map(async (ad) => await ad.populate("creator").execPopulate());
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
