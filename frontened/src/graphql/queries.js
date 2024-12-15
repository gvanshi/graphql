import { gql } from "@apollo/client";

export const GET_TASKS = gql`
    query {
        tasks {
            id
            title
            description
            status
        }
    }
`;
