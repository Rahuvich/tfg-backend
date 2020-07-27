//! https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/

const typeDefs = `
scalar Date


interface Node {
    _id: ID!
    createdAt: Date!
    updatedAt: Date
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

  enum AnimalType {
    DOG
    BIRD
    CAT
    FISH
    REPTILE
    BUNNY
    RODENT
    OTHER

  }

  type AuthData {
    user: User!
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

  input AnimalAdInput {
    type: AnimalType
    tags: [String!]!
    photos: [String]
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
    size: DogSize
  }

  input AnimalAdInputOptional {
    _id: ID!
    type: AnimalType
    tags: [String!]
    photos: [String]
    name: String
    description: String
    activityLevel: ActivityLevel
    birthDate: Date
    male: Boolean
    adoptionTax: Float
    weight: Float
    personality: [String!]
    mustKnow: String
    deliveryInfo: [DeliveryStatus!]
    breed: String
    size: DogSize
  }

  interface User implements Node{
    _id: ID!

    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String

    createdAt: Date!
    updatedAt: Date
  }

  type Protectora implements User & Node{
    _id: ID!

    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String

    web: String

    createdAt: Date!
    updatedAt: Date
  }

  type Profesional implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String

    web: String

    createdAt: Date!
    updatedAt: Date
  }

  type Particular implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String

    createdAt: Date!
    updatedAt: Date
  }

  interface Ad implements Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!

      createdAt: Date!
      updatedAt: Date
  }

type ProductAd implements Ad & Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!

    title: String!
    price: Float!
    description: String!

    createdAt: Date!
    updatedAt: Date
}
type ServiceAd implements Ad & Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!

    title: String!
    priceHour: Float!
    description: String!

    createdAt: Date!
    updatedAt: Date
}

interface AnimalAd implements Ad & Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!
      
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

    createdAt: Date!
    updatedAt: Date
}

type Dog implements AnimalAd & Ad & Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!
      
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

    createdAt: Date!
    updatedAt: Date
}

type OtherAnimal implements AnimalAd & Ad & Node{
    _id: ID!

      
      tags: [String!]!
      photos: [String]
      creator: User!
      
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

    type: AnimalType

    createdAt: Date!
    updatedAt: Date
}

  type Query {
    helloWorld: String!
    login(email: String!, password: String!): AuthData!
    getUser(id: String!): User
    currentUser: User
    getAnimalAd(id: String!): AnimalAd
  }

  type Mutation{
    createUser(userInput: UserInput!) : AuthData!
    updateUser(userInput: UserInputOptional!) : User!
    createAnimalAd(adInput: AnimalAdInput!) : AnimalAd!
    updateAnimalAd(adInput: AnimalAdInputOptional!) : AnimalAd!
    deleteAnimalAd(id: String!) : AnimalAd!
  }



`;
module.exports = typeDefs;
