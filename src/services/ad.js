import { AnimalAd, ProductAd, ServiceAd } from "../models/ad";
import UserService from "./user";
import PaginationService from "./pagination";
import { escapeRegex } from "../../helpers/regex";
import CloudinaryService from "./cloudinary";
import util from "util";
const { performance } = require("perf_hooks");

class AdService {
  constructor() {}

  // * General
  async resolvePhotos(list, options) {
    return await Promise.all(
      list.map(async (str) => {
        var parts = str.split("base/");
        return await CloudinaryService.getImage(
          `base/${parts[parts.length - 1]}`,
          options
        );
      })
    );
  }

  async getLastestFromCategory(category) {
    switch (category) {
      case "PRODUCTS":
        return await ProductAd.find().sort({ createdAt: "desc" });
      case "SERVICES":
        return await ServiceAd.find().sort({ createdAt: "desc" });
      case "DOGS":
        return await AnimalAd.find({ type: "DOG" }).sort({ createdAt: "desc" });
      case "CATS":
        return await AnimalAd.find({ type: "CAT" }).sort({ createdAt: "desc" });
      case "BIRDS":
        return await AnimalAd.find({ type: "BIRD" }).sort({
          createdAt: "desc",
        });
      case "RODENTS":
        return await AnimalAd.find({ type: "RODENT" }).sort({
          createdAt: "desc",
        });
      case "FISHES":
        return await AnimalAd.find({ type: "FISH" }).sort({
          createdAt: "desc",
        });
      case "REPTILES":
        return await AnimalAd.find({ type: "REPTILE" }).sort({
          createdAt: "desc",
        });
      case "BUNNIES":
        return await AnimalAd.find({ type: "BUNNY" }).sort({
          createdAt: "desc",
        });
      case "OTHERS":
        return await AnimalAd.find({ type: "OTHER" }).sort({
          createdAt: "desc",
        });
      default:
        throw new Error("Category does not exists");
    }
  }

  async getAds(userId, category, first, after) {
    const adList = await this.getLastestFromCategory(category);

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

    const edgesResulted = await Promise.all(
      await edges.map(async (edge) => {
        await edge.node.populate("creator").execPopulate();
        await edge.node.creator.populate("valuations.author").execPopulate();
        return edge;
      })
    );

    const obj = {
      edges: edgesResulted,
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
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
    return obj;
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
    if (!filters) return [];
    let query = {
      $and: [],
    };

    let obj;

    for (const prop in filters) {
      if (filters[prop] === null) {
        delete filters[prop];
        continue;
      }
      if (filters[prop] instanceof Array) {
        obj = {};
        obj[prop] = { $all: [] };

        for (let i = 0; i < filters[prop].length; ++i) {
          const regex = new RegExp(escapeRegex(filters[prop][i]), "i");
          obj[prop].$all.push(regex);
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
    return await Promise.all(
      list.map(async (ad) => await ad.populate("creator").execPopulate())
    );
  }

  async getIndexAdFromUser(userId, adId) {
    const ads = await this.searchAds({ creator: userId });

    const orderedList = ads.sort((ad, ad2) => ad.createdAt < ad2.createdAt);

    const index = orderedList.findIndex((ad) => ad.id === adId);

    return index < 0 ? orderedList.length : index;
  }

  // * Specific

  // Animal
  async deleteAnimalAd(userId, adId) {
    const ad = await AnimalAd.findByIdAndDelete(adId).populate("creator");

    CloudinaryService.deleteAdImages(
      (await UserService.getUser(userId)).email,
      await this.getIndexAdFromUser(userId, adId),
      ad.photos.length
    );

    return ad;
  }

  async updateAnimalAd(userId, adInput) {
    const data = { ...adInput };

    if (data.photos) {
      data.photos = await CloudinaryService.updateAdImages(
        data.photos,
        (await UserService.getUser(userId)).email,
        await this.getIndexAdFromUser(userId, data._id),
        (await this.getAd(data._id)).photos.length
      );
    }

    var deleteSize = false;
    if (data.type) {
      if (data.type === "DOG") {
        if (!("size" in data)) {
          throw new Error("Dogs ads must specify size field");
        }
      } else {
        deleteSize = true;
        if ("size" in data) {
          data.size = undefined;
        }
      }
    }

    const ad = await AnimalAd.findByIdAndUpdate(data._id, data, {
      new: true,
    }).populate("creator");

    if (deleteSize) {
      ad.size = undefined;
      await ad.save();
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

    const data = {
      ...adInput,
      photos: await CloudinaryService.uploadAdImages(
        adInput.photos,
        user.email,
        await this.getIndexAdFromUser(userId)
      ),
    };

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

    const data = {
      ...adInput,
      photos: await CloudinaryService.uploadAdImages(
        adInput.photos,
        user.email,
        await this.getIndexAdFromUser(userId)
      ),
    };

    data.creator = user;
    data.fromModel = user.constructor.modelName;

    const ad = await new ProductAd(data).save();
    return ad;
  }

  async updateProductAd(userId, data) {
    if (data.photos) {
      data.photos = await CloudinaryService.updateAdImages(
        data.photos,
        (await UserService.getUser(userId)).email,
        await this.getIndexAdFromUser(userId, data._id),
        (await this.getAd(data._id)).photos.length
      );
    }

    const ad = await ProductAd.findByIdAndUpdate(data._id, data, {
      new: true,
    }).populate("creator");

    return ad;
  }

  async deleteProductAd(userId, adId) {
    const ad = await ProductAd.findByIdAndDelete(adId).populate("creator");

    CloudinaryService.deleteAdImages(
      (await UserService.getUser(userId)).email,
      await this.getIndexAdFromUser(userId, adId),
      ad.photos.length
    );

    return ad;
  }

  // Service
  async deleteServiceAd(userId, adId) {
    const ad = await ServiceAd.findByIdAndDelete(adId).populate("creator");

    CloudinaryService.deleteAdImages(
      (await UserService.getUser(userId)).email,
      await this.getIndexAdFromUser(userId, adId),
      ad.photos.length
    );

    return ad;
  }

  async updateServiceAd(userId, data) {
    if (data.photos) {
      data.photos = await CloudinaryService.updateAdImages(
        data.photos,
        (await UserService.getUser(userId)).email,
        await this.getIndexAdFromUser(userId, data._id),
        (await this.getAd(data._id)).photos.length
      );
    }

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

    const data = {
      ...adInput,
      photos: await CloudinaryService.uploadAdImages(
        adInput.photos,
        user.email,
        await this.getIndexAdFromUser(userId)
      ),
    };

    data.creator = user;
    data.fromModel = user.constructor.modelName;

    const ad = await new ServiceAd(data).save();
    return ad;
  }
}

export default new AdService();
