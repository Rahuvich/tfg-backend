import UserService from "../src/services/user";
import AdService from "../src/services/ad";
import util from "util";
var casual = require("casual").fr_FR;

casual.define("user", function (type) {
  return {
    type: type,
    email: casual.email,
    thumbnail: `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596720086/base/mock/users/thumbnail-${casual.integer(
      0,
      8
    )}.png`,
    address: casual.address,
    name: type === "PARTICULAR" ? casual.full_name : casual.company_name,
    password: "tester",
    phone: casual.unix_time,
  };
});

casual.define("animalAd", function () {
  return {
    type: casual.random_element([
      "DOG",
      "BIRD",
      "CAT",
      "FISH",
      "REPTILE",
      "BUNNY",
      "RODENT",
      "OTHER",
    ]),
    tags: casual.array_of_words(7),
    photos: [
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/animal-${casual.integer(
        0,
        3
      )}.png`,
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/animal-${casual.integer(
        0,
        3
      )}.png`,
    ],
    name: casual.username,
    description: casual.sentences(casual.integer(10, 20)),
    activityLevel: casual.random_element(["HIGH", "MEDIUM", "LOW"]),
    birthDate: casual.moment.toISOString(),
    male: casual.coin_flip,
    adoptionTax: casual.integer(24, 80),
    weight: casual.integer(6, 35),
    personality: casual.array_of_words(3),
    mustKnow: casual.coin_flip
      ? undefined
      : casual.sentences(casual.integer(1, 7)),
    deliveryInfo: [
      casual.random_element([
        "VACCINATED",
        "DEWORMED",
        "HEALTHY",
        "STERILIZED",
        "IDENTIFIED",
        "MICROCHIP",
      ]),
      casual.random_element([
        "VACCINATED",
        "DEWORMED",
        "HEALTHY",
        "STERILIZED",
        "IDENTIFIED",
        "MICROCHIP",
      ]),
      casual.random_element([
        "VACCINATED",
        "DEWORMED",
        "HEALTHY",
        "STERILIZED",
        "IDENTIFIED",
        "MICROCHIP",
      ]),

      casual.random_element([
        "VACCINATED",
        "DEWORMED",
        "HEALTHY",
        "STERILIZED",
        "IDENTIFIED",
        "MICROCHIP",
      ]),
    ],
    breed: casual.title,
    size: casual.random_element(["BIG", "MEDIUM", "SMALL"]),
  };
});

casual.define("productAd", function () {
  return {
    photos: [
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/product-${casual.integer(
        0,
        3
      )}.jpg`,
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/product-${casual.integer(
        0,
        3
      )}.jpg`,
    ],
    tags: casual.array_of_words(7),
    title: casual.title,
    description: casual.sentences(casual.integer(10, 20)),
    price: casual.double(15, 80),
  };
});

casual.define("serviceAd", function () {
  return {
    photos: [
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/services-${casual.integer(
        0,
        3
      )}.jpg`,
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/services-${casual.integer(
        0,
        3
      )}.jpg`,
    ],
    tags: casual.array_of_words(7),
    title: casual.title,
    description: casual.sentences(casual.integer(10, 20)),
    priceHour: casual.double(15, 80),
  };
});

exports.fillDB = async () => {
  const getUser = (b, type) => {
    return b
      ? {
          type: "PARTICULAR",
          name: "Mabe",
          email: "mabe@mabe.com",
          address: "C/ Sants 388, Barcelona",
          password: "tester",
          phone: 691014931,
          thumbnail: `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596720086/base/mock/users/thumbnail-${casual.integer(
            0,
            8
          )}.png`,
        }
      : casual.user(type);
  };

  let b = true;
  for (let i = 0; i < 23; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(b, "PARTICULAR"));
      b = false;
      if (user) {
        for (let j = 0; j < casual.integer(0, 2); ++j) {
          await AdService.createAnimalAd(user._id, casual.animalAd);
        }
        for (let j = 0; j < casual.integer(0, 2); ++j) {
          await AdService.createServiceAd(user._id, casual.serviceAd);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  for (let i = 0; i < 23; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(b, "PROTECTORA"));
      if (user) {
        for (let j = 0; j < casual.integer(1, 15); ++j) {
          await AdService.createAnimalAd(user._id, casual.animalAd);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  for (let i = 0; i < 23; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(b, "PROFESIONAL"));
      if (user) {
        for (let j = 0; j < casual.integer(0, 3); ++j) {
          await AdService.createProductAd(user._id, casual.productAd);
        }
        for (let j = 0; j < casual.integer(0, 3); ++j) {
          await AdService.createServiceAd(user._id, casual.serviceAd);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
