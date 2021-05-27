import axios, { AxiosResponse }  from 'axios';

import env from '../env';

interface HerokuDomain {
  cname: string;
  hostname: string;
}

const {
  HEROKU_TOKEN,
  HEROKU_APP_NAME,
} = env;

const api = axios.create({
  baseURL: `https://api.heroku.com/apps/${HEROKU_APP_NAME}/domains`,
  headers: {
    Accept: 'application/vnd.heroku+json; version=3',
    Authorisation: `Bearer ${HEROKU_TOKEN}`,
  },
});

export const getDomains = () => api
  .get<void, AxiosResponse<HerokuDomain[]>>('/')
  .then(({ data }) => data);

export const createDomain = (hostname: string) => api
  .post('/', { hostname });

export const deleteDomain = (hostname: string) => api
  .delete(`/${hostname}`);
