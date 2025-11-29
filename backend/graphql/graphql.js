import { ApolloServer } from "@apollo/server";
import { graphQLSchema } from "./schema/schema.js";
import { graphQLResolvers } from "./resolvers/resolvers.js";

export const graphQLServer = () => {
  const server = new ApolloServer({
    typeDefs: graphQLSchema,
    resolvers: graphQLResolvers,
  });

  return server;
};
