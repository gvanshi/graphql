const { gql } = require("apollo-server");

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!, description: String!, status: String!): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): String
  }

  type Subscription {
    taskUpdated: Task
  }
`;

module.exports = typeDefs;
