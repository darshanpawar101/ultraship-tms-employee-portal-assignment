import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import { graphQLServer } from "./graphql/graphql.js";
import { expressMiddleware } from "@as-integrations/express5";
import { authenticate } from "./middleware/auth.middleware.js";

import path from "path";

dotenv.config({ path: "./.env" });

const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = Number(process.env.PORT) || 4000;
const mongoURI = process.env.MONGO_URI;
const __dirname = path.resolve();

connectDB(mongoURI);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

// Initializing Apollo Server
const server = graphQLServer();
await server.start();

// GraphQL endpoint with authentication context
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authContext = await authenticate(req);
      return authContext;
    },
  })
);

// app.get("/", (req, res) => {
//   res.json({
//     message: "Server is Running",
//   });
// });

if (envMode === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/:path(*)", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
  console.log(`📊 GraphQL endpoint: http://localhost:${port}/graphql`);
  console.log(`🌍 Environment: ${envMode}`);
});
