import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import TaskList from "./components/TaskList";

function App() {
    return (
        <ApolloProvider client={client}>
            <div>
                <h1>Task Manager</h1>
                <TaskList />
            </div>
        </ApolloProvider>
    );
}

export default App;
