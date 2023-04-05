import { ILanguageRate, IProject } from '../../github-client/types';

export class UserGithubInformationDto {
  user: {
    name: string;
    introduce: string;
    imageUrl: string;
    contact: {
      phone: string;
      email: string;
    };
  };

  commitCount: string;

  project: IProject[];

  languages: ILanguageRate[];
}
