import { Inject, Injectable } from '@nestjs/common';
import { graphql } from '@octokit/graphql';
import { ConfigType } from '@nestjs/config';
import githubConfig from '../config/githubConfig';

@Injectable()
export class GithubClientService {
  private readonly graphqlClient;

  constructor(
    @Inject(githubConfig.KEY) private config: ConfigType<typeof githubConfig>,
  ) {
    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${this.config.auth.token}`,
      },
    });
  }

  async getRepositoriesAndLanguages(userId: string) {
    return this.graphqlClient(`{
    user(login: "${userId}") {
      repositories(first: 100) {
        nodes {
          name
          languages(first: 100) {
            edges {
              node{
                name
              }
              size
            }
          }
        }
      }
    }
  }`);
  }

  async getPinnedRepositories(userId: string) {
    return this.graphqlClient(`{
    user(login: "${userId}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              name
              description
              url
              owner {
                login
              }
            }
          }
        }
      }
    }
  }`);
  }
}
