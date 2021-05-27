import axios, { AxiosResponse } from 'axios';

import env from '../env';
import csvToArray from '../helpers/csv-to-array';

interface GetDnsRecordsResponse {
  result: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

const {
  HOSTNAME,
  CLOUDFLARE_ZONE,
  CLOUDFLARE_TOKEN,
} = env;

const hostnames = csvToArray(HOSTNAME);
const zones = csvToArray(CLOUDFLARE_ZONE).slice(0, hostnames.length);

if (zones.length > 1 && zones.length < hostnames.length) {
  throw new Error('[Chard] zone is missing for one of the hostnames');
}

const hostnamesZones = hostnames
  .reduce<Record<string, string | undefined>>((acc, next, index) => ({
    ...acc,
    [next]: zones[index] || zones[0],
  }), {});

const getZoneByHostname = (hostname: string) => hostnamesZones[hostname.replace(/^[0-9]*-/, '')];

const api = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4/zones/',
  headers: {
    Authorization: `Bearer ${CLOUDFLARE_TOKEN}`
  },
});

export const getDnsRecords = async () => {
  const promises = zones.map((zone) => api
    .get<void, AxiosResponse<GetDnsRecordsResponse>>(`${zone}/dns_records`)
    .then(({ data }) => data.result));

  return (await Promise.all(promises)).flat();
}

export const createDnsRecord = (hostname: string, cname: string) => {
  const zone = getZoneByHostname(hostname);
  if (!zone) throw new Error('[Chard] DNS record creation failed, hostname zone not found');

  return api.post(`${zone}/dns_records`, {
    name: hostname,
    content: cname,
    type: 'CNAME',
    proxied: true,
  });
};

export const deleteDnsRecord = async (cname: string) => {
  const dnsRecords = await getDnsRecords();
  const record = dnsRecords.find(({ content }) => content === cname);

  if (!record) throw new Error('[Chard] DNS record deletion failed, record not found by cname');

  const zone = getZoneByHostname(record.name);

  if (!zone) throw new Error('[Chard] DNS record deletion failed, hostname zone not found');

  return api.delete(`${zone}/dns_records/${record.id}`);
}
