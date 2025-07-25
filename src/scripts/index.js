const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
let userDataEl = document.querySelector('.profile-data');

let currentRepo = 0;
let currentUsername = "";

function triggerSearch() {
    const userName = inputSearch.value.trim();
    if (userName) {
        currentUsername = userName;
        currentRepo = 0;
        getUserProfile(userName);
    };
};

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    triggerSearch();
});

async function user(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}`);

        if (!response.ok) throw new Error(`Request failed with status ${response.status}: User not found.`)

        return await response.json();
    } catch (err) {
        console.error(err);
        return null
    }
};

async function repos(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`);

        if (!response.ok) throw new Error(`Request failed with status ${response.status}: Repository not found.`)

        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

function getUserProfile(userName) {
    user(userName)
        .then(userData => {
            let userInfo =
                `<div class="info">
                    <img src="${userData.avatar_url}" alt="${userData.login}'s GitHub Profile Picture">
                    <div class="data">
                        <h2>${userData.name ?? "Name not provided 😢"}</h2>
                        <p>${userData.bio ?? "This profile’s waiting for a story to tell 😢"}</p>
                    </div>
                </div>`

            userDataEl.innerHTML = userInfo;
            userDataEl.classList.remove('hidden');

            getUserRepositories(userName);
        })
        .catch(err => {
            userDataEl.innerHTML =
                `<p role="alert">⚠️ ${err.message || "Failed to fetch user."}</p>`;

            userDataEl.classList.remove('hidden');
        });
};

function getUserRepositories(userName) {
    repos(userName)
        .then(reposData => {
            if (!Array.isArray(reposData) || reposData.length === 0) {
                userDataEl.insertAdjacentHTML('beforeend',
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
                    <p class="repo-counter">Total repositories: ${reposData.length}</p>
                    <div class="carousel"></div>
                    <div class="repo-btn-container">
                        <button id="btn-previous" class="btn-arrow" aria-label="Previous repository">previous repo</button>
                        <button id="btn-next" class="btn-arrow" aria-label="Next repository">next repo</button>
                    </div>
                </div>`

            userDataEl.insertAdjacentHTML('beforeend', repoInfo);

            updateRepoView(reposData[currentRepo]);

            document.getElementById('btn-next').addEventListener('click', () => {
                currentRepo = (currentRepo + 1) % reposData.length;

                updateRepoView(reposData[currentRepo]);
            });

            document.getElementById('btn-previous').addEventListener('click', () => {
                currentRepo = (currentRepo - 1 + reposData.length) % reposData.length;
                updateRepoView(reposData[currentRepo])
            });
        })
        .catch(err => {
            let carousel = document.querySelector('.carousel');

            if (carousel) {
                carousel.innerHTML = `<p role="alert">⚠️ ${err.message || "We couldn't load the repositories. Please try again later."}</p>`
            } else {
                userDataEl.insertAdjacentHTML('beforeend', `<p class="error">⚠️ ${err.message || "We couldn't load the repositories. Please try again later."}</p>`);
            }
        })
};

function updateRepoView(repo) {
    let carousel = document.querySelector('.carousel');

    if (!carousel || !repo) return;


    let repoUrl = `https://${currentUsername}.github.io/${repo.name}`;
    let previewImg = `https://api.microlink.io/?url=${encodeURIComponent(repoUrl)}&screenshot=true&meta=false&embed=screenshot.url`;

    console.log(`Preview URL: https://${currentUsername}.github.io/${repo.name}`);

    carousel.innerHTML =
        `<div class="image-loader">
            <div class="loader"></div>
        </div>`;

    let img = new Image();
    img.src = previewImg;
    img.classList.add('preview-page');

    img.onload = () => {
        carousel.innerHTML =
            `<img class="preview-page" src="${previewImg}" alt="Preview of ${repo.name}"/>
            <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`;
    };

    img.onerror = () => {
        carousel.innerHTML =
            `<p role="alert">⚠️ We couldn't load the image. Please try again later.</p>
            <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`
    };
};
