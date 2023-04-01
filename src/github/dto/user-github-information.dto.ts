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

  project: {
    name: string;
    description: string;
    language: string;
    starCount: number;
  };

  languages: {
    name: string;
    rate: number;
  }[];
}
