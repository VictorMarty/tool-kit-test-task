import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createGQLClient } from './gql-client';
import { repositoriesReducer } from '../entities/repositories';

const rootReducer = combineReducers({
    repositories: repositoriesReducer
});


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: { client: createGQLClient() },
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;