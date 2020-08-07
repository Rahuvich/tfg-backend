import { AnimalAd, ProductAd, ServiceAd } from "../../models/ad";
import AdService from "../../services/ad";
import CloudinaryService from "../../services/cloudinary";
import util from "util";

module.exports = {
  Ad: {
    __resolveType(data) {
      if (data instanceof AnimalAd) {
        if (data.type === "DOG") {
          return "Dog";
        } else return "OtherAnimal";
      }
      if (data instanceof ProductAd) {
        return "ProductAd";
      }
      if (data instanceof ServiceAd) {
        return "ServiceAd";
      }
      throw new Error(`Custom error: Ad unidentified ${data}`);
    },
  },
  AnimalAd: {
    __resolveType(data) {
      if (data.type === "DOG") {
        return "Dog";
      } else return "OtherAnimal";
    },
  },
  Dog: {
    photos: async (obj, { options }, context, info) => {
      var list = [];
      for (let i = 0; i < obj.photos.length; i++) {
        var str = obj.photos[i];
        var parts = str.split("base/");
        list.push(
          await CloudinaryService.getImage(
            `base/${parts[parts.length - 1]}`,
            options
          )
        );
      }
      return list;
    },
  },
  OtherAnimal: {
    photos: async (obj, { options }, context, info) => {
      var list = obj.photos;
      for (var str in list) {
        var parts = str.split("base/");
        list.push(
          await CloudinaryService.getImage(
            `base/${parts[parts.length - 1]}`,
            options
          )
        );
      }
      return list;
    },
  },
  ProductAd: {
    photos: async (obj, { options }, context, info) => {
      var list = obj.photos;
      for (var str in list) {
        var parts = str.split("base/");
        list.push(
          await CloudinaryService.getImage(
            `base/${parts[parts.length - 1]}`,
            options
          )
        );
      }
      return list;
    },
  },
  ServiceAd: {
    photos: async (obj, { options }, context, info) => {
      var list = obj.photos;
      for (var str in list) {
        var parts = str.split("base/");
        list.push(
          await CloudinaryService.getImage(
            `base/${parts[parts.length - 1]}`,
            options
          )
        );
      }
      return list;
    },
  },

  Query: {
    getAd: async (_, { id }) => {
      try {
        return await AdService.getAd(id);
      } catch (err) {
        throw err;
      }
    },
    searchAds: async (_, { filters }) => {
      try {
        return await AdService.searchAds(filters);
      } catch (err) {
        throw err;
      }
    },
    ads: async (_, { category, first, after }, req) => {
      try {
        return await AdService.getAds(req.userId, category, first, after);
      } catch (err) {
        throw err;
      }
    },
  },

  Mutation: {
    createAnimalAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }

      try {
        return await AdService.createAnimalAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    updateAnimalAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (
        !(await AdService.isUserCreatorOfAd(req.userId, adInput._id))
      ) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.updateAnimalAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    deleteAnimalAd: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (!(await AdService.isUserCreatorOfAd(req.userId, id))) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.deleteAnimalAd(req.userId, id);
      } catch (err) {
        throw err;
      }
    },

    createProductAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }

      try {
        return await AdService.createProductAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    updateProductAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (
        !(await AdService.isUserCreatorOfAd(req.userId, adInput._id))
      ) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.updateProductAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    deleteProductAd: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (!(await AdService.isUserCreatorOfAd(req.userId, id))) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.deleteProductAd(req.userId, id);
      } catch (err) {
        throw err;
      }
    },

    createServiceAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      }

      try {
        return await AdService.createServiceAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    updateServiceAd: async (_, { adInput }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (
        !(await AdService.isUserCreatorOfAd(req.userId, adInput._id))
      ) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.updateServiceAd(req.userId, adInput);
      } catch (err) {
        throw err;
      }
    },
    deleteServiceAd: async (_, { id }, req) => {
      if (!req.isAuth) {
        throw new Error("You must be logged in");
      } else if (!(await AdService.isUserCreatorOfAd(req.userId, id))) {
        throw new Error("Ad not found in your account");
      }

      try {
        return await AdService.deleteServiceAd(req.userId, id);
      } catch (err) {
        throw err;
      }
    },
  },
};
