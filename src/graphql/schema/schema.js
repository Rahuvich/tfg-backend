const typeDefs = `
scalar Date
scalar Upload

interface Node {
    _id: ID!
    createdAt: Date!
    updatedAt: Date
}


  type Query {
    login(email: String!, password: String!): AuthData!
    getUser(id: String!): User
    currentUser: User
    myRooms : [Room!]

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

    createMessage(toUser: String!, text: String!, ad: String) : Message!
  }
`;
module.exports = typeDefs;
