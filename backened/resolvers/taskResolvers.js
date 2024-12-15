const Task = require("../models/Task");

const TASK_UPDATED = "TASK_UPDATED";

const resolvers = {
  Query: {
    // Fetch all tasks
    tasks: async () => {
      const tasks = await Task.find();
      console.log("Fetched tasks:", tasks);
      return tasks;
    },
  },
  Mutation: {
    // Create a new task and publish the event for subscriptions
    createTask: async (_, { title, description, status }, { pubsub }) => {
      const task = new Task({ title, description, status });
      await task.save();

      // Log task creation and publishing event
      console.log("Task created and publishing TASK_UPDATED event:", task);

      // Publish the TASK_UPDATED event
      pubsub.publish(TASK_UPDATED, { taskUpdated: task });
      return task;
    },
  },
  Subscription: {
    // Listen for task updates
    taskUpdated: {
      subscribe: (_, __, { pubsub }) => {
        if (!pubsub) {
          throw new Error("❌ PubSub instance is not initialized");
        }
        console.log("✅ Subscription initialized for TASK_UPDATED");
        return pubsub.asyncIterator([TASK_UPDATED]);
      },
    },
  },
};

module.exports = resolvers;
