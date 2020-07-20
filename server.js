const casual = require("casual");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const expressGraphQL = require("express-graphql");
const express = require("express");
const { makeExecutableSchema, mockServer, MockList } = require("graphql-tools");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const schemaString = `
scalar Date
scalar DateTime


interface Node {
    id: ID!
}

enum DeliveryStatus {
    VACCINATED
    DEWORMED
    HEALTHY
    STERILIZED
    IDENTIFIED
    MICROCHIP
  }

  enum DogSize {
    BIG
    MEDIUM
    SMALL
  }

  enum ActivityLevel {
    HIGH
    MEDIUM
    LOW
  }

  interface User implements Node{
    id: ID!

    name: String!
    address: String!
    phone: Int!
    thumbnail: String
  }

  type Protectora implements User & Node{
    id: ID!

    name: String!
    address: String!
    phone: Int!
    thumbnail: String

    web: String
  }

  type Profesional implements User & Node{
    id: ID!
    
    name: String!
    address: String!
    phone: Int!
    thumbnail: String

    web: String
  }

  type Particular implements User & Node{
    id: ID!
    
    name: String!
    address: String!
    phone: Int!
    thumbnail: String

  }

  interface Ad implements Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
  }

type ProductAd implements Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!

    title: String!
    price: Float!
    description: String!
}
type ServiceAd implements Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!

    title: String!
    priceHour: Float!
    description: String!
}

interface AnimalAd implements Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Dog implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String

    size: DogSize!
}

type Bird implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Cat implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Fish implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Reptile implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Bunny implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

type Rodent implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}
type Other implements AnimalAd & Ad & Node{
    id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
      
    name: String!
    description: String!
    activityLevel: ActivityLevel!
    birthDate: Date!
    male: Boolean!
    adoptionTax: Float!
    weight: Float!
    personality: [String!]!
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]!
    breed: String
}

  type Query {
    protectoras: [Protectora]
    animalsAds: [AnimalAd]
    servicesAds: [ServiceAd]
    productsAds: [ProductAd]
    user(id: ID!):User
  }

  schema {
    query: Query
  }
`;

const resolveFunctions = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  User: {
    __resolveType(data) {
      return data.typename; // typename property must be set by your mock functions
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: schemaString,
  resolvers: resolveFunctions,
});

const server = mockServer(schema, {
  Query: () => ({
    animalsAds: () => new MockList(10),
    protectoras: () => new MockList(25),
  }),
  DateTime: () => casual.unix_time,
  Date: () => String(casual.date((format = "YYYY-MM-DD"))),
  Profesional: () => ({
    name: casual.full_name,
    phone: casual.integer((from = 676964253), (to = 691014930)),
    address: casual.address,
    web: casual.url,
    thumbnail:
      "https://res.cloudinary.com/tfg-petsworld/image/upload/c_thumb,w_200,g_face/v1587813949/sample.jpg",
  }),
  Particular: () => ({
    name: casual.full_name,
    phone: casual.integer((from = 676964253), (to = 691014930)),
    address: casual.address,
    thumbnail:
      "https://res.cloudinary.com/tfg-petsworld/image/upload/c_thumb,w_200,g_face/v1587813949/sample.jpg",
  }),
  Protectora: () => ({
    name: casual.full_name,
    phone: casual.integer((from = 676964253), (to = 691014930)),
    address: casual.address,
    web: casual.url,
    thumbnail:
      "https://res.cloudinary.com/tfg-petsworld/image/upload/c_thumb,w_200,g_face/v1587813949/sample.jpg",
  }),
  Dog: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/three-dogs.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Cat: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Bird: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Bunny: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Rodent: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Reptile: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Other: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
  Fish: () => ({
    date: casual.unix_time,
    name: casual.name,
    description: casual.words((n = 20)),
    birthDate: String(casual.date((format = "YYYY-MM-DD"))),
    male: casual.coin_flip,
    adoptionTax: casual.integer((from = 10), (to = 120)),
    weight: casual.integer((from = 10), (to = 120)),
    personality: casual.array_of_words((n = 4)),
    photos: [
      "https://res.cloudinary.com/tfg-petsworld/image/upload/ar_1:1,c_fill,g_auto,q_10,w_1000/v1587813957/samples/animals/kitten-playing.jpg",
    ],
    breed: casual.words((n = 2)),
  }),
});

// Initialize the app
const app = express();

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => console.log("Server running"));
