import axios, { AxiosResponse } from 'axios';

import env from '../env';

interface GithubPR {
  body: string;
}

const {
  ICON_READY,
  LINK_MARKER,
  GITHUB_TOKEN,
  ICON_PENDING,
  HEROKU_PR_NUMBER,
  GITHUB_REPOSITORY,
} = env;

const api = axios.create({
  baseURL: `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${HEROKU_PR_NUMBER}`,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

const getBody = () => api
  .get<void, AxiosResponse<GithubPR>>('/')
  .then(({ data }) => data.body);

const setBody = (body: string) => api
  .patch('/', { body });
