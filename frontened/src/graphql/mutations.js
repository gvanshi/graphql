import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
    mutation CreateTask($title: String!, $description: String!, $status: String!) {
        createTask(title: $title, description: $description, status: $status) {
            id
            title
            description
            status
        }
    }
`;
