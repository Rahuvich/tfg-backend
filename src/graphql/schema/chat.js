export const typeDef = `
    type Room {
        user1: User!
        user2: User!
        messages: [Message!]
        
        createdAt: Date!
        updatedAt: Date
    }

    type Message {
        text: String!
        ad: Ad
        sender: User!

        createdAt: Date!
        updatedAt: Date
    }
  
    type Subscription {
        messageSent : Message
    }

`;
