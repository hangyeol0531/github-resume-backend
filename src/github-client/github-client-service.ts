import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { graphql } from '@octokit/graphql';

@Injectable()
export class GithubClientService {
  private readonly octokit;

  private readonly graphqlClient;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    this.graphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
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
      user(login: "GabrielBB") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
          ... on Repository {
              ${username}
            }
          }
        }
      }
    };`;
    return this.graphqlClient(query);
  }
}
