export const typeDef = `
    input ForwardArguments {
        first: Int!
        after: String!
    }

    input BackwardsArguments {
        last: Int!
        before: String!
    }

    type AdEdge {
        node: Ad
        cursor: String!
    }

    type AdConnection {
        edges: [AdEdge]
        pageInfo: PageInfo!
        totalCount: Int!
    }

    type PageInfo {
        hasPreviousPage: Boolean!
        hasNextPage: Boolean!
        startCursor: String
        endCursor: String
    }

`;
