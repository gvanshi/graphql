import { gql } from "@apollo/client";

export const TASK_UPDATED = gql`
    subscription {
        taskUpdated {
            id
            title
            description
            status
        }
    }
`;
