export default {
  Query: {
    protectoras: async (parent, args, { Protectoras }) => {
      const protectoras = await Protectoras.find();
      return protectoras.map((p) => {
        p._id = p._id.toString();
        return p;
      });
    },
  },
  Mutation: {
    newUser: async (
      parent,
      args,
      { Protectoras, Profesionales, Particulares }
    ) => {
      var user;
      switch (args.type) {
        case "PROTECTORA":
          user = await new Protectoras(args).save();
          break;
        default:
          return null;
      }

      user._id = user._id.toString();
      return user;
    },
  },
};
