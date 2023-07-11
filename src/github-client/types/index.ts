import { LatestCommittedRepositoryDto } from '../../github/dto/user-github-information.dto';
import SocialAccountProvider from './SocialAccountProvider';

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
  homepageUrl: string;
  stargazerCount: number;
  forkCount: number;
  owner: {
    login: string;
  };
  primaryLanguage: {
    name: string;
  };
  repositoryTopics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
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
        isFork: boolean;
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
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    email: string;
    websiteUrl: string | null;
    repositories: {
      totalCount: number;
    };
    socialAccounts: {
      nodes: [
        {
          provider: SocialAccountProvider;
          url: string;
        },
      ];
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

export interface ILatestPushedRepository {
  user: {
    repositories: {
      nodes: LatestCommittedRepositoryDto[];
    };
  };
}
