const typeDefs = `
scalar Date
scalar DateTime


interface Node {
    _id: ID!
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

  enum UserType {
    PARTICULAR
    PROFESIONAL
    PROTECTORA
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input UserInput {
    type: UserType!
    name: String!
    address: String!
    phone: Int!
    email: String!
    password: String!
    web: String
  }

  input UserInputOptional {
    name: String
    address: String
    phone: Int
    email: String
    password: String
    web: String
  }

  interface User implements Node{
    _id: ID!

    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String
    password: String
  }

  type Protectora implements User & Node{
    _id: ID!

    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String
    password: String

    web: String
  }

  type Profesional implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String
    password: String

    web: String
  }

  type Particular implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String
    password: String

  }

  interface Ad implements Node{
    _id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!
  }

type ProductAd implements Ad & Node{
    _id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!

    title: String!
    price: Float!
    description: String!
}
type ServiceAd implements Ad & Node{
    _id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!

    title: String!
    priceHour: Float!
    description: String!
}

interface AnimalAd implements Ad & Node{
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    _id: ID!

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
    helloWorld: String!
    login(email: String!, password: String!): AuthData!
    getProtectora(id: String!): Protectora!
    getAllProtectoras: [Protectora!]!
    animalsAds: [AnimalAd]
    servicesAds: [ServiceAd]
    productsAds: [ProductAd]
  }

  type Mutation{
    createUser(userInput: UserInput) : User
    updateUser(userInput: UserInputOptional) : User!
  }



`;
module.exports = typeDefs;
