import { createAsyncThunk, createReducer, createSelector } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../app/store";
import { createGQLClient } from "../../app/gql-client";
import { FIND_REPOSITORY_BY_ID, GET_REPOSITORIES_BY_SEARCH_STRING, GET_VIEWER_REPOSITORIES } from "./queries";
import { Repository, RepositoryFullInfo } from "./types";

const repositoriesState = {
    searchString: "",
    repositories: [] as Array<Repository>,
    viewerRepositories: [] as Array<Repository>,
    isLoading: false,
    selectedRepository: null as null | RepositoryFullInfo,
};

const ACTIONS = {
    FIND_REPOSITORIES_BY_SEARCH_STRING: "FIND_REPOSITORIES_BY_SEARCH_STRING",
    FIND_VIEWER_REPOSITORY: "FIND_VIEWER_REPOSITORY",
    FIND_REPOSITORIES_BY_ID: "FIND_REPOSITORIES_BY_ID"
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        if (response.error) {
            console.error("FIND_VIEWER_REPOSITORY ERROR RESPONSE!!1")

            return ThunkAPI.rejectWithValue(response.error);
        }

        const prettifyRepositoriesData = mapResponseDataToStoreType(response.repositories.nodes)

        return ThunkAPI.fulfillWithValue(prettifyRepositoriesData);

    },
);

export const findRepositoryById = createAsyncThunk<unknown, string, {
    dispatch: AppDispatch,
    state: RootState,
    extra: {
        client: ReturnType<typeof createGQLClient>
    }
}
>(
    ACTIONS.FIND_REPOSITORIES_BY_ID,
    async (repositoryId, ThunkAPI) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await ThunkAPI.extra.client.query("node", FIND_REPOSITORY_BY_ID, {
            "id": repositoryId,
        });


        if (response.error) {
            console.error(response.error);

            return ThunkAPI.rejectWithValue(response.error);
        }

        const prettifyRepository = mapResponseDataToStoreType([response])[0]

        return ThunkAPI.fulfillWithValue(prettifyRepository);
    },
);

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
        .addCase(findRepositoryById.pending, (state) => {
            state.isLoading = true;
            state.selectedRepository = null;

            return state

        })
        .addCase(findRepositoryById.fulfilled, (state, action) => {
            state.isLoading = false;

            state.selectedRepository = action.payload as RepositoryFullInfo;

            return state

        })
        .addCase(findRepositoryById.rejected, (state) => {
            state.isLoading = false;
            state.selectedRepository = null;
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

export const getSelectedRepositoryData = createSelector(
    getSearchedRepositoriesInStore,
    repositories => repositories.selectedRepository,
)