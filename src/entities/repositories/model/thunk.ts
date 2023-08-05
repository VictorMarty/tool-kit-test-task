import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../../app/store/store";
import type { createGQLClient } from "../../../shared/api/gql-client";
import { ACTIONS } from "./actions";
import {
  FIND_REPOSITORY_BY_ID,
  GET_REPOSITORIES_BY_SEARCH_STRING,
  GET_VIEWER_REPOSITORIES,
} from "./queries";
import { mapResponseDataToStoreType } from "./utils";

export const findRepositoriesBySearchString = createAsyncThunk<
  unknown,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: {
      client: ReturnType<typeof createGQLClient>;
    };
  }
>(
  ACTIONS.FIND_REPOSITORIES_BY_SEARCH_STRING,
  async (searchString, ThunkAPI) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await ThunkAPI.extra.client.query(
      "search",
      GET_REPOSITORIES_BY_SEARCH_STRING,
      {
        query: searchString,
        type: "REPOSITORY",
        first: 100,
      },
    );

    if (response.error) {
      console.error("FIND_REPOSITORIES_BY_SEARCH_STRING ERROR RESPONSE!!1");

      return ThunkAPI.rejectWithValue(response.error);
    }

    const prettifyRepositoriesData = mapResponseDataToStoreType(response.nodes);

    return ThunkAPI.fulfillWithValue(prettifyRepositoriesData);
  },
);

export const findViewerRepositories = createAsyncThunk<
  unknown,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: {
      client: ReturnType<typeof createGQLClient>;
    };
  }
>(ACTIONS.FIND_VIEWER_REPOSITORY, async (_, ThunkAPI) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await ThunkAPI.extra.client.query(
    "viewer",
    GET_VIEWER_REPOSITORIES,
    {
      first: 100,
    },
  );

  if (response.error) {
    console.error("FIND_VIEWER_REPOSITORY ERROR RESPONSE!!1");

    return ThunkAPI.rejectWithValue(response.error);
  }

  const prettifyRepositoriesData = mapResponseDataToStoreType(
    response.repositories.nodes,
  );

  return ThunkAPI.fulfillWithValue(prettifyRepositoriesData);
});

export const findRepositoryById = createAsyncThunk<
  unknown,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: {
      client: ReturnType<typeof createGQLClient>;
    };
  }
>(ACTIONS.FIND_REPOSITORIES_BY_ID, async (repositoryId, ThunkAPI) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await ThunkAPI.extra.client.query(
    "node",
    FIND_REPOSITORY_BY_ID,
    {
      id: repositoryId,
    },
  );

  if (response.error) {
    console.error(response.error);

    return ThunkAPI.rejectWithValue(response.error);
  }

  const prettifyRepository = mapResponseDataToStoreType([response])[0];

  return ThunkAPI.fulfillWithValue(prettifyRepository);
});
