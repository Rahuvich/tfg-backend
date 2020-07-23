require("dotenv").config();
import mongoose from "mongoose";

class Connection {
  constructor() {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tfg-cluster.femwl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

    console.log(`URI: ${uri}`);

    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));
  }
}

export default new Connection();
