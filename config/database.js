require("dotenv").config();
import mongoose from "mongoose";

class Connection {
  constructor() {
// mongodb+srv://<username>:<password>@tfg-cluster.femwl.mongodb.net/test

    const uri = `mongodb+srv://tfg-cluster.femwl.mongodb.net/?retryWrites=true&w=majority&authSource=admin`;

    console.log(`URI: ${uri}`);

    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);

    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        dbName: process.env.MONGO_DB,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));
  }
}

export default new Connection();
