export const typeDef = `

type AuthData {
    user: User!
    token: String!
    tokenExpiration: Int!
  }

  type DistanceData {
    protectora: Protectora!
    distance: Int!
    travelTime: Int!
  }


enum UserType {
    PARTICULAR
    PROFESIONAL
    PROTECTORA
  }



input UserInput {
    type: UserType!
    name: String!
    address: String
    phone: Int
    thumbnail: Upload
    email: String!
    password: String!
    web: String
  }

  input UserInputOptional {
    name: String
    address: String
    phone: Int
    email: String
    thumbnail: Upload
    password: String
    web: String
  }


input ValuationInput {
    userId: ID!
    value: Float!
    comment: String!
  }


type Valuation {
    value: Float!
    comment: String!
    author: User!
    createdAt: Date!
    updatedAt: Date
  }

  

  interface User implements Node{
    _id: ID!

    name: String!
    email: String!
    address: String
    phone: Int
    thumbnail(options: ImageOptions): String
    valuations: [Valuation!]

    createdAt: Date!
    updatedAt: Date
  }

  type Protectora implements User & Node{
    _id: ID!

    name: String!
    email: String!
    address: String
    phone: Int
    thumbnail(options: ImageOptions): String
    valuations: [Valuation!]

    web: String

    createdAt: Date!
    updatedAt: Date
  }

  type Profesional implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String
    phone: Int
    thumbnail(options: ImageOptions): String
    valuations: [Valuation!]

    web: String

    createdAt: Date!
    updatedAt: Date
  }

  type Particular implements User & Node{
    _id: ID!
    
    name: String!
    email: String!
    address: String
    phone: Int
    thumbnail(options: ImageOptions): String
    valuations: [Valuation!]

    createdAt: Date!
    updatedAt: Date
  }

`;
