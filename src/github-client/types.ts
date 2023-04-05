export interface IRepositoryLanguage {
  edges: {
    node: {
      name: string;
    };
    size: number;
  }[];
}

interface IPinnedRepositoryItem {
  name: string;
  description: string;
  url: string;
  owner: {
    login: string;
  };
}

export interface IPinnedRepository {
  user: {
    pinnedItems: {
      edges: IPinnedRepositoryItem[];
    };
  };
}

export interface IRepository {
  user: {
    repositories: {
      nodes: {
        name: string;
        languages: IRepositoryLanguage;
      }[];
    };
  };
}

export interface ILanguageSize {
  name: string;
  size: number;
}
export interface ILanguageRate {
  name: string;
  rate: number;
}
