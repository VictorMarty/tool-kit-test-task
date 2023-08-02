import { ApolloClient, DocumentNode, InMemoryCache, OperationVariables } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

type Query = <QV extends OperationVariables, RT>(name: string, query: DocumentNode, variables?: QV) => Promise<RT>;
type Mutate = <MV extends OperationVariables, RT>(name: string, mutation: DocumentNode, variables?: MV) => Promise<RT>;

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
            credentials: 'include',
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'no-cache',
            },
            mutate: {
                fetchPolicy: 'no-cache',
            },
        },
    });

    return client;
};