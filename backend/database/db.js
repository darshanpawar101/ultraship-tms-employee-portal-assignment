import mongoose from "mongoose";

export const connectDB = (uri) =>
  mongoose
    .connect(uri, { dbName: "ultraship-db" })
    .then((c) => {
      console.log(`connected with ${c.connection.name}`);
    })
    .catch((error) => {
      console.log(
        "Some Error occurred while connecting to the database",
        error
      );
    });
