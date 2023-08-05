import { gql } from "@apollo/client";

export const GET_REPOSITORIES_BY_SEARCH_STRING = gql`
  query findRepositoriesByString(
    $query: String!
    $type: SearchType!
    $first: Int
  ) {
    search(query: $query, type: $type, first: $first) {
      nodes {
        ... on Repository {
          id
          name
          stargazerCount
          url
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  edges {
                    node {
                      ... on Commit {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_VIEWER_REPOSITORIES = gql`
  query getViewerRepositories($first: Int, $privacy: RepositoryPrivacy) {
    viewer {
      repositories(first: $first, privacy: $privacy) {
        nodes {
          id
          name
          stargazerCount
          url
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  edges {
                    node {
                      ... on Commit {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const FIND_REPOSITORY_BY_ID = gql`
  query findRepositoryById($id: ID!) {
    node(id: $id) {
      ... on Repository {
        id
        name
        stargazerCount
        url
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 1) {
                edges {
                  node {
                    ... on Commit {
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
        owner {
          avatarUrl
          id
          login
          url
        }
        languages(first: 100) {
          nodes {
            name
            color
          }
        }
        description
      }
    }
  }
`;
