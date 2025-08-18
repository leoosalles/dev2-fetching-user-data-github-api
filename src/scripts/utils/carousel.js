import {currentUsername } from '../global.js';

function updateRepoView(repo) {
    const carousel = document.querySelector('.carousel');

    if (!carousel || !repo) return;

    let repoUrl = `https://${currentUsername}.github.io/${repo.name}`;
    let previewImg = `https://api.microlink.io/?url=${encodeURIComponent(repoUrl)}&screenshot=true&meta=false&embed=screenshot.url`;

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
             <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`;
    };
};

export { updateRepoView };