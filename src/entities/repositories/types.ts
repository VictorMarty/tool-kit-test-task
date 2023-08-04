export type Repository = {
    id: string,
    name: string,
    stargazerCount: number,
    url: string,
    lastCommitDate: string,

}

export type RepositoryFullInfo = Repository & {
    description: string,
    languages: {
        nodes: Array<{ name: string, color: string }>
    },
    owner: {
        avatarUrl: string,
        id: string,
        login: string,
        url: string,
    }
}