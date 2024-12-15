const express = require("express");
const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const mongoose = require("mongoose");
const { PubSub } = require("graphql-subscriptions");
require("dotenv").config();

// Import schema and resolvers
const typeDefs = require("./schema/taskSchema");
const resolvers = require("./resolvers/taskResolvers");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Initialize PubSub for subscriptions
const pubsub = new PubSub();

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express application
const app = express();

// Create an HTTP server
const httpServer = http.createServer(app);

// Set up WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Pass context dynamically for WebSocket server
useServer(
  {
    schema,
    context: () => ({ pubsub }), // Ensure PubSub is passed correctly
  },
  wsServer
);

// Set up Apollo Server for HTTP
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ pubsub }), // Ensure PubSub is available in HTTP requests
});

// Start Apollo Server
(async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Start the HTTP and WebSocket servers
  httpServer.listen(4000, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:4000/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:4000/graphql`);
  });
})();
