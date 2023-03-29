import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';

@Injectable()
export class GithubClientService {
  constructor() {}

  async getLanguages(owner: string, repo: string) {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const result = await octokit.request(
      'GET /repos/{owner}/{repo}/languages',
      {
        owner: 'hangyeol0531',
        repo: 'slack-status-api',
      },
    );

    return result;
  }
}
