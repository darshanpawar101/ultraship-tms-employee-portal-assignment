import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const backendURI =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/graphql"
    : "/graphql";

const httpLink = new HttpLink({
  uri: backendURI,
});

const authLink = new SetContextLink((operation, prevContext) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...prevContext.headers,

      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  // Use ApolloLink.from to clearly chain: Auth -> Http
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
