import bcrypt from "bcryptjs";

export default {
  // * QUERYS
  Query: {
    protectoras: async (parent, args, { Protectoras }) => {
      const protectoras = await Protectoras.find();
      return protectoras.map((p) => {
        p._id = p._id.toString();
        return p;
      });
    },
  },

  // * MUTATIONS
  Mutation: {
    createUser: async (
      parent,
      args,
      { Protectoras, Profesionales, Particulares }
    ) => {
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      let user;
      switch (args.userInput.type) {
        case "PROTECTORA":
          user = await new Protectoras({
            email: args.userInput.email,
            name: args.userInput.name,
            phone: args.userInput.phone,
            address: args.userInput.address,
            password: hashedPassword,
          }).save();
          break;
        case "PROFESIONAL":
          user = await new Profesionales({
            email: args.userInput.email,
            name: args.userInput.name,
            phone: args.userInput.phone,
            address: args.userInput.address,
            password: hashedPassword,
          }).save();
          break;
        case "PARTICULAR":
          user = await new Particulares({
            email: args.userInput.email,
            name: args.userInput.name,
            phone: args.userInput.phone,
            address: args.userInput.address,
            password: hashedPassword,
          }).save();
          break;
        default:
          return null;
      }

      user._id = user._id.toString();
      return user;
    },
  },
};
