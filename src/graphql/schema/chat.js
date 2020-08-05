export const typeDef = `
    type Room implements Node{
        _id: ID!

        user1: User!
        user2: User!
        messages: [Message!]
        
        createdAt: Date!
        updatedAt: Date
    }

    type Message implements Node{
        _id: ID!

        text: String!
        ad: Ad
        sender: User!

        createdAt: Date!
        updatedAt: Date
    }
  
    type Subscription {
        messageSent (roomId: String!) : Message
    }

`;
