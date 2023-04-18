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

export interface IUser {
  user: {
    name: string;
    avatarUrl: string;
    bio: string;
    email: string;
    websiteUrl: string;
    repositories: {
      totalCount: number;
    };
  };
}

export interface ICommitCount {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
    };
  };
}

export interface IContributionCount {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
      };
    };
  };
}
