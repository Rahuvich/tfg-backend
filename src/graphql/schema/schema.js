//! https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/

const typeDefs = `
scalar Date
scalar DateTime


interface Node {
    _id: ID!
    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
  }

  type Particular implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String!
    phone: Int!
    thumbnail: String
    password: String

    createdAt: String!
    updatedAt: String
  }

  interface Ad implements Node{
    _id: ID!

      date: DateTime!
      tags: [String!]!
      photos: [String]
      owner: User!

      createdAt: String!
      updatedAt: String
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

    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
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

    createdAt: String!
    updatedAt: String
}

type OtherAnimal implements AnimalAd & Ad & Node{
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

    createdAt: String!
    updatedAt: String
}

  type Query {
    helloWorld: String!
    login(email: String!, password: String!): AuthData!
    getUser(id: String!): User!
  }

  type Mutation{
    createUser(userInput: UserInput) : User
    updateUser(userInput: UserInputOptional) : User!
  }



`;
module.exports = typeDefs;
