import { AnimalAd, ProductAd, ServiceAd } from "../../models/ad";
import AdService from "../../services/ad";

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

  Query: {
    getAd: async (_, { id }) => {
      try {
        return await AdService.getAd(id);
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
        return await AdService.updateAnimalAd(adInput);
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
        return await AdService.deleteAnimalAd(id);
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
        return await AdService.updateProductAd(adInput);
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
        return await AdService.deleteProductAd(id);
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
        return await AdService.updateServiceAd(adInput);
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
        return await AdService.deleteServiceAd(id);
      } catch (err) {
        throw err;
      }
    },
  },
};
