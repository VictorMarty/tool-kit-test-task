import {
  ApolloClient,
  DocumentNode,
  InMemoryCache,
  OperationVariables,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

type Query = <QV extends OperationVariables, RT>(
  name: string,
  query: DocumentNode,
  variables?: QV,
) => Promise<RT>;
type Mutate = <MV extends OperationVariables, RT>(
  name: string,
  mutation: DocumentNode,
  variables?: MV,
) => Promise<RT>;

export type GraphQLClient = {
  query: Query;
  mutate: Mutate;
};

export const createGQLClient = () => {
  const cache = new InMemoryCache({
    addTypename: false,
    resultCaching: false,
  });

  const client = new ApolloClient({
    cache: cache,
    link: createUploadLink({
      uri: import.meta.env.VITE_URL,
      includeUnusedVariables: false,
      headers: {
        authorization: import.meta.env.VITE_TOKEN
          ? `Bearer ${import.meta.env.VITE_TOKEN}`
          : "",
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
      },
      mutate: {
        fetchPolicy: "no-cache",
      },
    },
  });

  const query: Query = (name, query, variables) => {
    return client
      .query({
        query,
        variables,
        fetchPolicy: "no-cache",
      })
      .then(({ data, error }) => {
        return error
          ? {
              data: data[name],
              error,
            }
          : data[name];
      });
  };

  const mutate: Mutate = (name, mutation, variables) => {
    return client
      .mutate({
        mutation,
        variables,
      })
      .then(({ data }) => data[name]);
  };

  return { query, mutate };
};
