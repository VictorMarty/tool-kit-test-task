import { createReducer } from "@reduxjs/toolkit";
import { Repository, RepositoryFullInfo } from "../types";
import { findRepositoriesBySearchString, findRepositoryById, findViewerRepositories } from "./thunk";


const repositoriesState = {
    searchString: "",
    repositories: [] as Array<Repository>,
    viewerRepositories: [] as Array<Repository>,
    isLoading: false,
    selectedRepository: null as null | RepositoryFullInfo,
};



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
