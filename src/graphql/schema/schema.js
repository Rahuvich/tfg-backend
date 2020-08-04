//! https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/

const typeDefs = `
scalar Date

interface Node {
    _id: ID!
    createdAt: Date!
    updatedAt: Date
}


  type Query {
    login(email: String!, password: String!): AuthData!
    getUser(id: String!): User
    currentUser: User

    getAd(id: String!): Ad

    searchAds(filters: AdFilters!) : [Ad!]

    getCloseShelters(fromAddress: String) : [DistanceData!]

    ads(first: Int!, after: String) : AdConnection!
  }

  type Mutation{
    createUser(userInput: UserInput!) : AuthData!
    updateUser(userInput: UserInputOptional!) : User!

    createAnimalAd(adInput: AnimalAdInput!) : AnimalAd!
    updateAnimalAd(adInput: AnimalAdInputOptional!) : AnimalAd!
    deleteAnimalAd(id: String!) : AnimalAd!

    createProductAd(adInput: ProductAdInput!) : ProductAd!
    updateProductAd(adInput: ProductAdInputOptional!) : ProductAd!
    deleteProductAd(id: String!) : ProductAd!

    createServiceAd(adInput: ServiceAdInput!) : ServiceAd!
    updateServiceAd(adInput: ServiceAdInputOptional!) : ServiceAd!
    deleteServiceAd(id: String!) : ServiceAd!

    valuateUser(input: ValuationInput) : User!
    removeValuation(id: String!) : User!

    saveAd(id: String!): [Ad!]
    unsaveAd(id: String!): [Ad!]
  }
`;
module.exports = typeDefs;
