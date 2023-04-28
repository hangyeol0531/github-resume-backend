import { Inject, Injectable } from '@nestjs/common';
import { graphql } from '@octokit/graphql';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import githubConfig from '../config/githubConfig';
import {
  ICommitCount,
  IContributionCount,
  ILatestPushedRepository,
  IPinnedRepository,
  IRepository,
  IUser,
} from './types';
import { YearAndMonthDateDto } from '../common/dto/common.dto';

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
        repositories {
          totalCount
        }
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
              repositoryTopics(first: 100){
                nodes {
                  topic{
                    name
                  }
                }
              }
              stargazerCount
              forkCount
              url
              homepageUrl
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

  async getNowYearCommitCount(
    userId: string,
    year: number,
  ): Promise<ICommitCount> {
    return this.githubGraphqlClient(`{
    user(login: "${userId}") {
          contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z"){
          totalCommitContributions
        }
      }
    }`);
  }

  async getContributionCount(
    userId: string,
    { month, year }: YearAndMonthDateDto,
  ): Promise<IContributionCount> {
    const isDecember: boolean = month === 12;
    const nextYear: number = isDecember ? year + 1 : year;
    const nextMonth: number = isDecember ? 1 : month + 1;
    return this.githubGraphqlClient(`{
      user(login: "${userId}") {
        contributionsCollection(
        from: "${year}-${`0${month}`.slice(-2)}-01T00:00:00Z"
        to: "${nextYear}-${`0${nextMonth}`.slice(-2)}-01T00:00:00Z"
        ) {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }`);
  }

  async getLatestPushedRepository(
    userId: string,
  ): Promise<ILatestPushedRepository> {
    return this.githubGraphqlClient(`{
        user(login: "${userId}") {
          repositories(first: 1, ownerAffiliations: [OWNER, COLLABORATOR], orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              name
              url
            }
          }
        }
      }
   `);
  }
}
