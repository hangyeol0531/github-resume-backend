import { Inject, Injectable } from '@nestjs/common';
import { graphql } from '@octokit/graphql';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import githubConfig from '../config/githubConfig';
import { IPinnedRepository, IRepository, IUser } from './types';

@Injectable()
export class GithubClientService {
  private readonly githubGraphqlClient;

  constructor(
    private readonly githubClient: HttpService,
    @Inject(githubConfig.KEY) private config: ConfigType<typeof githubConfig>,
  ) {
    this.githubGraphqlClient = graphql.defaults({
      headers: {
        authorization: `token ${this.config.auth.token}`,
      },
    });
  }

  async getExistsUser(userId: string): Promise<boolean> {
    try {
      const { status }: { status: number } =
        await this.githubClient.axiosRef.get(userId);
      return status === 200;
    } catch (e) {
      return false;
    }
  }

  async getUserInformation(userId: string): Promise<IUser> {
    return this.githubGraphqlClient(`{
      user(login: "${userId}"){
        name
        avatarUrl
        bio
        email
        websiteUrl
      }
    }`);
  }

  async getRepositoriesAndLanguages(userId: string): Promise<IRepository> {
    return this.githubGraphqlClient(`{
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

  async getPinnedRepositories(userId: string): Promise<IPinnedRepository> {
    return this.githubGraphqlClient(`{
    user(login: "${userId}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              name
              description
              primaryLanguage {
                name
              }
              stargazerCount
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
