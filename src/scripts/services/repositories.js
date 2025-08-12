import { formatHttpError } from '../utils/formatHttpError.js';

async function getRepos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos`);

    if (!response.ok) throw formatHttpError(response, 'Repositories');

    const repos = await response.json();

    if (repos.length === 0) {
        throw formatHttpError({
            status: 404,
            url: `https://api.github.com/users/${userName}/repos`
        }, 'Repositories')
    };

    return repos;
};

export { getRepos };