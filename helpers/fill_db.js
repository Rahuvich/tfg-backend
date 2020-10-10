import UserService from "../src/services/user";
import AdService from "../src/services/ad";
import util from "util";
import { Mongoose } from "mongoose";
var casual = require("casual").fr_FR;

const SHELTERS_NAME = ['Protectora Santa Marta', 'Protectora Eulesier', 'Protectora Alcorsa','Asociacion Colaboracion Animal', 'SOS Mascotas de Adra', 'ANIMALIA', 'K-Project Rescue']
const PET_NAMES = ['Lupita', 'Rangui', 'Toby', 'Kali', 'Thor', 'Akira', 'Merlin', 'Dimi', 'Kenya', 'Sam', 'Shira']
const SERVICES_TITLE = ['Peluqueria Canina', 'Paseador de perros', 'Veterinaria Santa Maria','Veterinarios Carlos']
const PRODUCT_TITLE = ['Juguete en forma de hueso', 'Juguete para perros', 'Comida Alcalina','Pienso sin lactosa']
const PET_DESCRIPTIONS = ['Es el abuelete de nuestro refugio, ha sido un perrete que lo ha pasado muy mal ya que ha estado media vida atado hasta que las compañeras del refugio lo rescataron. Es un perro tranquilo, al que le gusta pasear, es bueno y glotón.', 'Es una perra muy tranquila que solo quiere dar y recibir amor. Es sociable con los animales. Fue abandona a su suerte y gracias a que la encontramos esta estupenda y esperando esa familia que tanto desea', 'es un perro muy tranquilo y sociable, se lleva muy bien con todo el mundo y se porta muy bien en casa y en la calle. Fue abandonado por sus propietarios en la perrera después de tantos años siendo su fiel compañero. Ahora Dimi tendrá unos 13 años pero sigue mereciendo tener una familia que le quiera. Dale una oportunidad.', 'es una hembra de Pitbull de cuatro años, es una perrita muy juguetona, cariñosa, le gusta salir a correr, ha convivido con dos perritas pequeñas sin problema, se asusta bastante con ruido de truenos, cohetes y del escape de camiones.', 'Mi perro es un labrador de 2 años de edad que tiene sus vacunas y necesito darlos en adopción porque voy a viajar fuera y no se quedara nadie en casa...', 'Cachorro color negro con café pecho blanco pelo lacio corto ojos negros orejas medianas pertenece a una manada de 5 perros', 'Una perrita cariñosa y amigable, convive de preferencia con machos. Le gusta mucho hacer ejercicio.', 'es este cruce de pastor alemán, nacido en 2014. A Horus le encanta jugar y dar paseos tranquilos, y es muy cariñoso con las personas que conoce. Por otro lado, es desconfiado con desconocidos y necesita de una familia que tenga paciencia para conocerlo y para ayudarlo en su adaptación. Por otro lado, Horus es muy noble y besucón con sus personas Esperamos que llegue esa familia que le dé el apoyo que necesita para sentirse seguro y por fin le dé el hogar que tanto merece. Con Horus descubrirán un perro maravilloso que, aunque necesita paciencia para adaptarse, corresponde a sus personas con una fidelidad absoluta y devoción por ellos',  'llegó a la protectora procedente de otro centro donde no se adaptaba. Ha vivido mucho tiempo en la incertidumbre que supone el vivir una larga temporada en una jaula. Es un perro tranquilo aunque con energía para dar largos paseos. Las personas interesadas en adoptar que vienen a la protectora nunca preguntan por Skaner.Necesita conocer bien a su posible adoptante pero es uno de esos perros que una vez que confía crea un vínculo muy especial y fuerte. Cuando sale a pasear va saludando con una especie de abrazo y lametones a todos los voluntarios que se cruza por el camino Sería muy triste que Skaner tuviera que vivir mucho más tiempo en el refugio ya que nadie se fija en él. Si estás dispuesto a ayudar a un perro invisible quizás Skaner pueda formar parte de tu familia y ser feliz en el calor de un hogar.']

const PET_BREEDS = [
  'Comun europeo','Belga','Pastor A.','Comun negro', 'Yorkshire'
]



casual.define("user", function (type) {
  var name;
  if(type == 'PROTECTORA'){
    name = casual.random_element(SHELTERS_NAME)
  } else if(type == 'PARTICULAR'){
    name = casual.full_name
  } else {
    name = casual.company_name
  }

  return {
    type: type,
    email: casual.email,
    thumbnail: `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596720086/base/mock/users/${type}/thumbnail-${casual.integer(
      0,
      4
    )}.png`,
    address: casual.address,
    name: name,
    password: "tester",
    phone: casual.unix_time,
  };
});

casual.define("animalAd", function () {
  const type = casual.random_element([
    "DOG",
    "BIRD",
    "CAT",
    "FISH",
    "REPTILE",
    "BUNNY",
    "RODENT",
    "OTHER",
  ]);

  return {
    type: type,
    tags: casual.array_of_words(7),
    photos: [
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/${type}/animal-${casual.integer(
        0,
        3
      )}.png`,
      `https://res.cloudinary.com/tfg-petsworld/image/upload/v1596725933/base/mock/users/ads/${type}/animal-${casual.integer(
        0,
        3
      )}.png`,
    ],
    name: casual.random_element(PET_NAMES),
    description: casual.random_element(PET_DESCRIPTIONS),
    activityLevel: casual.random_element(["HIGH", "MEDIUM", "LOW"]),
    birthDate: casual.moment.toISOString(),
    male: casual.coin_flip,
    adoptionTax: casual.integer(24, 80),
    weight: casual.integer(6, 35),
    personality: casual.random_element(['timido','nervioso','jugueton','pesado'], ['timido','adorable','muy bueno','rabioso'],['amigable','agradable','energetico','nervioso']),
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
    breed: casual.random_element(PET_BREEDS),
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
    title: casual.random_element(PRODUCT_TITLE),
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
    title: casual.random_element(SERVICES_TITLE),
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
        }
      : casual.user(type);
  };

  let b = true;
  for (let i = 0; i < 70; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(b, "PARTICULAR"));
      if (user) {
        b = false;
        for (let j = 0; j < casual.integer(0, 3); ++j) {
          await AdService.createAnimalAd(user._id, casual.animalAd);
        }
        for (let j = 0; j < casual.integer(0, 3); ++j) {
          await AdService.createServiceAd(user._id, casual.serviceAd);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  for (let i = 0; i < 23; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(false, "PROTECTORA"));
      if (user) {
        for (let j = 0; j < casual.integer(5, 50); ++j) {
          await AdService.createAnimalAd(user._id, casual.animalAd);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  for (let i = 0; i < 100; ++i) {
    try {
      const { user } = await UserService.createUser(getUser(false, "PROFESIONAL"));
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

  console.log('Database filled')
};




import { Protectora, Profesional, Particular, SavedAds } from '../src/models/user';
import { AnimalAd, ProductAd, ServiceAd } from '../src/models/ad';
import { Message, Room } from '../src/models/chat';
exports.emptyDB = async () => {
  await Message.remove();
  await Room.remove();

  await AnimalAd.remove();
  await ProductAd.remove();
  await ServiceAd.remove();

  await SavedAds.remove();

  await Protectora.remove();
  await Profesional.remove();
  await Particular.remove();
  console.log('Database dropped')
};
