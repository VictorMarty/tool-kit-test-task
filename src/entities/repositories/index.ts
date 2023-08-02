import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const repositoriesState = {
    searchString: "",
    repositories: [] as Array<unknown>,
    isLoading: false,
};

const ACTIONS = {
    FIND_REPOSITORIES_BY_SEARCH_STRING: "FIND_REPOSITORIES_BY_SEARCH_STRING"
} as const;



export const findRepositoriesBySearchString = createAsyncThunk(
    ACTIONS.FIND_REPOSITORIES_BY_SEARCH_STRING,
    async (_, ThunkAPI) => {
        const state = ThunkAPI.getState() as RootState;

        console.log("findRepositoriesBySearchString thunk")
        // here graphql
        return true;
    },
);


export const repositoriesReducer = createReducer(repositoriesState, builder => {
    builder
        .addCase(findRepositoriesBySearchString.pending, state => {
            state.isLoading = true;
        })
        .addCase(findRepositoriesBySearchString.fulfilled, state => {
            state.isLoading = false;
        })
        .addCase(findRepositoriesBySearchString.rejected, state => {
            state.isLoading = false;
        })
});