// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapResponseDataToStoreType = (data: Array<any>) =>
  data.map((repositoryData) => {
    const lastCommitDate = repositoryData.defaultBranchRef
      ? repositoryData.defaultBranchRef?.target.history.edges[0].node
          .committedDate
      : "";
    return {
      ...repositoryData,
      lastCommitDate: lastCommitDate,
    };
  });
