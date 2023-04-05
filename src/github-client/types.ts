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
  stargazerCount: number;
  owner: {
    login: string;
  };
  primaryLanguage: {
    name: string;
  };
}

export interface IPinnedRepository {
  user: {
    pinnedItems: {
      edges: {
        node: IPinnedRepositoryItem;
      }[];
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

export interface IProject {
  name: string;
  description: string;
  url: string;
  language: string;
  starCount: number;
  owner: string;
}
