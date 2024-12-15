import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { CREATE_TASK } from "../graphql/mutations";
import { TASK_UPDATED } from "../graphql/subscriptions";

function TaskList() {
    // Fetch existing tasks
    const { data, loading, error } = useQuery(GET_TASKS);
    const [createTask] = useMutation(CREATE_TASK);
    const { data: subscriptionData } = useSubscription(TASK_UPDATED);

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    // Function to merge updated task into the task list
    const updateTaskList = useCallback((updatedTask) => {
        setTasks((prevTasks) => {
            const existingTask = prevTasks.find((task) => task.id === updatedTask.id);
            if (existingTask) {
                // Update existing task
                return prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            } else {
                // Add new task
                return [...prevTasks, updatedTask];
            }
        });
    }, []);

    // Update tasks when fetched data changes
    useEffect(() => {
        if (data && data.tasks) {
            setTasks(data.tasks);
        }
    }, [data]);

    // Handle real-time updates from subscription
    useEffect(() => {
        if (subscriptionData?.taskUpdated) {
            updateTaskList(subscriptionData.taskUpdated);
        }
    }, [subscriptionData, updateTaskList]);

    // Handle adding a new task
    const handleAddTask = async () => {
        if (!title || !description || !status) return;

        try {
            const { data: newTask } = await createTask({
                variables: { title, description, status },
            });

            if (newTask) {
                updateTaskList(newTask.createTask);
            }

            // Clear input fields
            setTitle("");
            setDescription("");
            setStatus("");
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.title}</strong>: {task.description} ({task.status})
                    </li>
                ))}
            </ul>

            <h3>Add Task</h3>
            <div>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <input
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Status"
                />
                <button onClick={handleAddTask} disabled={!title || !description || !status}>
                    Add Task
                </button>
            </div>
        </div>
    );
}

export default TaskList;
