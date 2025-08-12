import { getUser } from './services/users.js';
import { getRepos } from './services/repositories.js';
import { userObj } from './objects/user.js';
import { screen } from './objects/screen.js';
import { setCurrentUsername, setCurrentRepo } from './global.js';
import { formatHttpError } from './utils/formatHttpError.js';

const inputSearch = document.getElementById('input-search');

function triggerSearch() {
    const userName = inputSearch.value.trim();
    if (userName) {
        setCurrentUsername(userName);
        setCurrentRepo(0);
        getUserData(userName);
    };
};

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    triggerSearch();
});

async function getUserData(userName) {
    try {
        const userResponse = await getUser(userName);

        if (!userResponse.ok) {
            screen.renderError(formatHttpError(userResponse, 'User'));
            return;
        };

        const userData = await userResponse.json();
        userObj.setInfo(userData);

        let repoData;

        try {
            repoData = await getRepos(userName);
        } catch (repoError) {
            screen.renderError(formatHttpError({ status: repoError.code || 500, url: '', ok: false }, 'Repositories'));
            return;
        };

        userObj.setRepositories(repoData);

        screen.renderUser(userObj);
        screen.renderRepo(userObj);
    } catch (err) {
        screen.renderError(formatHttpError({ status: 500, url: '', ok: false }, 'Request'));
    };
};