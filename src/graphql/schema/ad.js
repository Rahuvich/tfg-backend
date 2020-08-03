export const typeDef = `


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


input ServiceAdInput {
    tags: [String!]!
    photos: [String]
    title: String!
    priceHour: Float!
    description: String!
  }

  input ServiceAdInputOptional {
    _id: ID!
    tags: [String!]
    photos: [String]
    title: String
    priceHour: Float
    description: String
  }


  input ProductAdInput {
    tags: [String!]!
    photos: [String]
    title: String!
    price: Float!
    description: String!
  }

  input ProductAdInputOptional {
    _id: ID!
    tags: [String!]
    photos: [String]
    title: String
    price: Float
    description: String
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

  input AdFilters {
    name: String,
    tags: [String!],
    breed: String,
    size: DogSize,
    deliveryInfo: [DeliveryStatus!],
    male: Boolean,
    activityLevel: ActivityLevel,
    type: AnimalType,
    creator: String
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
`;
