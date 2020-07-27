import { AnimalAd, ProductAd, ServiceAd } from "../../models/ad";
import AdService from "../../services/ad";

module.exports = {
  Ad: {
    __resolveType(data) {
      if (data instanceof AnimalAd) {
        return "AnimalAd";
      }
      if (data instanceof ProductAd) {
        return "ProductAd";
      }
      if (data instanceof ServiceAd) {
        return "ServiceAd";
      }
      return null;
    },
  },
  AnimalAd: {
    __resolveType(data) {
      if (data.type === "DOG") {
        return "Dog";
      } else return "OtherAnimal";
    },
  },

  Query: {
    getAnimalAd: async (_, { id }) => {
      try {
        return await AdService.getAnimalAd(id);
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
  },
};
