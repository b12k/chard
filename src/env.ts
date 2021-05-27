const envVars = [
  'HOSTNAME',
  'ICON_READY',
  'LINK_MARKER',
  'GITHUB_TOKEN',
  'HEROKU_TOKEN',
  'ICON_PENDING',
  'CLOUDFLARE_ZONE',
  'HEROKU_APP_NAME',
  'HEROKU_PR_NUMBER',
  'CLOUDFLARE_TOKEN',
  'GITHUB_REPOSITORY',
] as const;

type RequiredKey = typeof envVars[number];
type Env = Record<RequiredKey, string>;

const env = {} as Env;
envVars.forEach((key) => {
  env[key] = process.env[`CHARD_${key}`] || process.env[key] || '';
});

env.ICON_READY = env.ICON_READY || '🚀';
env.LINK_MARKER = env.LINK_MARKER || '## Preview:';
env.ICON_PENDING = env.ICON_PENDING || '⏳';

for (const key in env) {
  if (env[key as RequiredKey] === '') {
    throw new Error(`[Chard] Missing required environment variable ${key}`);
  }
}

export default env;
