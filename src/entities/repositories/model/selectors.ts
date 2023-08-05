import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store/store";

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