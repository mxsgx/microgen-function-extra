export const mongoUrlBuilder = (config: MongoURLBuilderConfig): string => {
  const components = [];

  if (typeof config.protocol === 'undefined') {
    components.push('mongodb');
  } else {
    components.push(config.protocol);
  }

  components.push('://');

  if (config.auth && config.auth.user && config.auth.password) {
    const { user, password } = config.auth;

    components.push(
      `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`
    );
  }

  const servers = [];

  for (let server of config.servers) {
    servers.push(
      `${server.host}${
        typeof server.port === 'number' ? `:${server.port}` : ''
      }`
    );
  }

  components.push(servers.join(','));

  if (config.database) {
    components.push(`/${config.database}`);
  }

  if (config.options) {
    const options = [];

    for (let option in config.options) {
      options.push(`${option}=${config.options[option]}`);
    }

    components.push(`?${options.join('&')}`);
  }

  return components.join('');
};
