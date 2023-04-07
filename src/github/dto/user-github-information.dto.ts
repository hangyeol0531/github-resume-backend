export interface UserDto {
  id: string;
  name: string;
  introduce: string;
  imageUrl: string;
  contact: {
    email: string;
    websiteUrl: string;
  };
}

export interface RepositoryDto {
  name: string;
  description: string;
  url: string;
  language: string;
  starCount: number;
  owner: string;
}

export interface LanguageRateDto {
  name: string;
  rate: number;
}

export interface UserGithubInformationDto {
  user: UserDto;
  repositories: RepositoryDto[];
  languages: LanguageRateDto[];
}
