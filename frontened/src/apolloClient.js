import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

// HTTP Link for queries and mutations
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    options: {
      reconnect: true, // Automatically reconnect on disconnect
    },
  })
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// Apollo Client instance
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
