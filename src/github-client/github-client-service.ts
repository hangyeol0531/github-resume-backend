import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';

@Injectable()
export class GithubClientService {
  private readonly octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  async getRepositories(username: string) {
    return this.octokit.request(`GET /users/${username}/repos`);
  }

  async getLanguages(owner: string, repo: string) {
    return this.octokit.request(`GET /repos/${owner}/${repo}/languages`);
  }
}
