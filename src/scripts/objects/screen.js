import { currentRepo, setCurrentRepo } from '../global.js';
import { updateRepoView } from '../utils/carousel.js';
import { formatHttpError } from '../utils/formatHttpError.js';

let userDataEl = document.querySelector('.profile-data');

const screen = {
    userProfile: userDataEl,
    renderUser(userObj) {
        this.userProfile.innerHTML =
            `<div class="info">
                    <img class="avatar" src="${userObj.avatarUrl}" alt="${userObj.name}'s GitHub Profile Picture">
                    <div class="data">
                        <h2>${userObj.name ?? "Name not provided 😢"}</h2>
                        <p>${userObj.bio ?? "This profile’s waiting for a story to tell 😢"}</p>
                    </div>
             </div>`;

        this.userProfile.classList.remove('hidden');
    },
    renderRepo(userObj) {
        if (!Array.isArray(userObj.repositories) || userObj.repositories.length === 0) {
            this.userProfile.insertAdjacentHTML('beforeend',
                `<div class="repositories">
                        <h2>Repositories</h2>
                        <p class="repo-counter">Total repositories: 0</p>
                        <p role="alert">No repository found</p>
                 </div>`
            );

            return;
        }

        let repoInfo =
            `<div class="repositories">
                    <h2>Repositories</h2>
                    <p class="repo-counter">Total repositories: ${userObj.repositories.length}</p>
                    <div class="carousel"></div>
                    <div class="repo-btn-container">
                        <button id="btn-previous" class="btn-arrow" aria-label="Previous repository">previous repo</button>
                        <button id="btn-next" class="btn-arrow" aria-label="Next repository">next repo</button>
                    </div>
             </div>`;

        this.userProfile.insertAdjacentHTML('beforeend', repoInfo);

        updateRepoView(userObj.repositories[currentRepo]);

        document.getElementById('btn-next').onclick = () => {
            let nextIndex = (currentRepo + 1) % userObj.repositories.length;

            setCurrentRepo(nextIndex);

            updateRepoView(userObj.repositories[nextIndex]);
        };

        document.getElementById('btn-previous').onclick = () => {
            let prevIndex = (currentRepo - 1 + userObj.repositories.length) % userObj.repositories.length;

            setCurrentRepo(prevIndex);

            updateRepoView(userObj.repositories[prevIndex]);
        };
    },
    renderError(response, context = 'Request') {
        const error = (response && response.message && response.code !== undefined)
            ? response
            : formatHttpError(response, context);

        let container;

        switch (error.context) {
            case 'User':
                container = this.userProfile;
                break;
            case 'Repositories':
                container = document.querySelector('.carousel') || this.userProfile;
                break;
            case 'Image':
                container = document.querySelector('.carousel');
                break;
            default:
                container = this.userProfile;
        };
        
        if (!container) return;

        container.innerHTML =
            `<p>${error.message}</p>`;

        this.userProfile.classList.remove('hidden');
    }
};

export { screen }