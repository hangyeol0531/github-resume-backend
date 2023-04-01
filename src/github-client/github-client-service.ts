import { Inject, Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { graphql } from '@octokit/graphql';
import { ConfigType } from '@nestjs/config';
import githubConfig from '../config/githubConfig';

@Injectable()
export class GithubClientService {
  private readonly octokit;

  private readonly graphqlClient;

  constructor(
    @Inject(githubConfig.KEY) private config: ConfigType<typeof githubConfig>,
  ) {
    this.octokit = new Octokit({
      auth: `${this.config.auth.token}`,
    });

    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${this.config.auth.token}`,
      },
    });
  }

  async getRepositories(username: string) {
    return this.octokit.request(`GET /users/${username}/repos`);
  }

  async getLanguages(owner: string, repo: string) {
    return this.octokit.request(`GET /repos/${owner}/${repo}/languages`);
  }

  async getPinnedRepositories(username: string) {
    const query = `{
    user(login: "${username}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
          }
        }
      }
    }
  }`;
    return this.graphqlClient(query);
  }
}
