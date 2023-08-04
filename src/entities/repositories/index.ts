import { createAsyncThunk, createReducer, createSelector } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store";
import { gql, useQuery } from "@apollo/client";
import { createGQLClient } from "../../gql-client";
import { GET_REPOSITORIES_BY_SEARCH_STRING, GET_VIEWER_REPOSITORIES } from "./queries";
import { Repository } from "./types";

const repositoriesState = {
    searchString: "",
    repositories: [] as Array<Repository>,
    viewerRepositories: [] as Array<Repository>,
    isLoading: false,
};

const ACTIONS = {
    FIND_REPOSITORIES_BY_SEARCH_STRING: "FIND_REPOSITORIES_BY_SEARCH_STRING",
    FIND_VIEWER_REPOSITORY: "FIND_VIEWER_REPOSITORY",
} as const;


const mapResponseDataToStoreType = (data: Array<any>) => data.map(repositoryData => {
    const lastCommitDate = repositoryData.defaultBranchRef ? repositoryData.defaultBranchRef?.target.history.edges[0].node.committedDate : ""
    return {
        ...repositoryData,
        lastCommitDate: lastCommitDate
    }
})

export const findRepositoriesBySearchString = createAsyncThunk<unknown, string, {
    dispatch: AppDispatch,
    state: RootState,
    extra: {
        client: ReturnType<typeof createGQLClient>
    }
}
>(
    ACTIONS.FIND_REPOSITORIES_BY_SEARCH_STRING,
    async (searchString, ThunkAPI) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await ThunkAPI.extra.client.query("search", GET_REPOSITORIES_BY_SEARCH_STRING, {
            "query": searchString,
            "type": "REPOSITORY",
            "first": 100,
        });

        if (response.error) {
            console.error("FIND_REPOSITORIES_BY_SEARCH_STRING ERROR RESPONSE!!1")
            // throw new Error("FIND_REPOSITORIES_BY_SEARCH_STRING ERROR RESPONSE!!1")

            return ThunkAPI.rejectWithValue(response.error);
        }

        const prettifyRepositoriesData = mapResponseDataToStoreType(response.nodes)

        return ThunkAPI.fulfillWithValue(prettifyRepositoriesData);
    },
);



export const findViewerRepositories = createAsyncThunk<unknown, void, {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch,
    state: RootState,
    extra: {
        client: ReturnType<typeof createGQLClient>
    }
}
>(
    ACTIONS.FIND_VIEWER_REPOSITORY,
    async (_, ThunkAPI) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await ThunkAPI.extra.client.query("viewer", GET_VIEWER_REPOSITORIES, {
            "first": 100,
        });

        console.log(response);

        if (response.error) {
            console.error("FIND_VIEWER_REPOSITORY ERROR RESPONSE!!1")

            return ThunkAPI.rejectWithValue(response.error);
        }

        const prettifyRepositoriesData = mapResponseDataToStoreType(response.repositories.nodes)

        return ThunkAPI.fulfillWithValue(prettifyRepositoriesData);

    },
);

// export const findRepositoryById = createAsyncThunk<unknown, string, {
//     // Optional fields for defining thunkApi field types
//     dispatch: AppDispatch,
//     state: RootState,
//     extra: {
//         client: ReturnType<typeof createGQLClient>
//     }
// }
// >(
//     ACTIONS.FIND_REPOSITORIES_BY_SEARCH_STRING,
//     async (repositoryId, ThunkAPI) => {
//         const state = ThunkAPI.getState()
//         const response = await ThunkAPI.extra.client.query("node", FIND_REPOSITORY_BY_ID, {
//             "id": repositoryId,
//         });

//         const pretify =

//             console.log(c);

//         // ThunkAPI.extra.client.query(ACTIONS.FIND_REPOSITORIES_BY_SEARCH_STRING, GET_REPOSITORIES_BY_SEARCH_STRING)

//         return true;
//     },
// );

export const repositoriesReducer = createReducer(repositoriesState, builder => {
    builder
        .addCase(findRepositoriesBySearchString.pending, state => {
            state.isLoading = true;

            return state
        })
        .addCase(findRepositoriesBySearchString.fulfilled, (state, action) => {
            state.isLoading = false;
            state.repositories = action.payload as Array<Repository>

            return state

        })
        .addCase(findRepositoriesBySearchString.rejected, state => {
            state.isLoading = false;

            return state
        })
        .addCase(findViewerRepositories.pending, state => {
            state.isLoading = true;

            return state
        })
        .addCase(findViewerRepositories.fulfilled, (state, action) => {
            state.isLoading = false;
            state.viewerRepositories = action.payload as Array<Repository>

            return state

        })
        .addCase(findViewerRepositories.rejected, state => {
            state.isLoading = false;

            return state
        })

});

const getSearchedRepositoriesInStore = (state: RootState) => state.repositories;

export const getSearchedRepositories = createSelector(
    getSearchedRepositoriesInStore,
    repositories => repositories.repositories,
);

export const getViewerRepositories = createSelector(
    getSearchedRepositoriesInStore,
    repositories => repositories.viewerRepositories,
);

export const checkIsLoadingData = createSelector(
    getSearchedRepositoriesInStore,
    repositories => repositories.isLoading,
)