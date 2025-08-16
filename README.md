# 🔎 GitHub User Search

**GitHub User Search** is a front-end web application that allows users to search for GitHub profiles and explore their repositories dynamically. Built with **HTML5**, **CSS3**, and **JavaScript (ES6 modules)**, it demonstrates asynchronous API calls, modular code architecture, and accessible UI design.

The app fetches user data and repositories from the **GitHub REST API**, displays profile details, and includes a carousel feature to browse repositories with live preview images generated via an external screenshot API. Error handling is comprehensive and user-friendly, ensuring smooth user experience even when API limits or errors occur.

This project was proposed to students of the Dev Quest course as part of the Advanced JavaScript module, focusing on API integration, dynamic UI rendering, and best practices in front-end development.

---

## 📌 Features

- Search GitHub users by username with instant API requests
- Fetch and display user profile information including avatar, name, and bio
- Retrieve user repositories and present them in a carousel with live preview images
- Graceful error handling for user not found, no repositories, API limits, and network errors
- Accessible form and results with semantic HTML and ARIA roles
- Modular project architecture with ES6 modules for services, UI rendering, utilities, and state management

---

## 📂 Project Structure

```
📁 src/
┃ ┣ 📂 css/
┃ ┃ ┣ 📄 style.css
┃ ┃ ┗ 📄 reset.css
┃ ┗ 📂 scripts/
┃   ┣ 📄 global.html
┃   ┣ 📄 index.html
┃   ┣ 📂 utils/
┃   ┃ ┣ 📄 carousel.js
┃   ┃ ┗ 📄 formatHttpError.js
┃   ┣ 📂 services/
┃   ┃ ┣ 📄 repositories.js
┃   ┃ ┗ 📄 users.js
┃   ┗ 📂 objects/
┃     ┣ 📄 screen.js
┃     ┗ 📄 user.js
📄 index.html
```
---

## 🧱 HTML Structure (index.html)

- A search form with accessible labels and placeholder prompts
- Main container dynamically updates with user profile and repositories info
- Interactive buttons to navigate between repositories in a carousel
- Live region for polite updates to screen readers on profile results<br><br>

### ✅ `role="main"`
```html
<main role="main">
```
**Purpose:** Explicitly defines the `<main>` element as the primary content area of the page.

**Benefit:** Screen readers can quickly jump to the main content, improving navigation for users relying on assistive technologies.<br><br>

### ✅ `role="search"`
```html
<form id="search-form" role="search">
```
**Purpose:** Indicates that the form is a search landmark.

**Benefit:** Screen readers can identify it as a dedicated search area, allowing quick access for users who want to find information.<br><br>

### ✅ `<label for="input-search">`
```html
<label for="input-search">Search User</label>
```
**Purpose:** Associates the text label with the search input via the for attribute.

**Benefit:** Ensures that screen readers announce the label text when the input field receives focus, improving clarity for visually impaired users.<br><br>


### ✅ `placeholder="Enter the GitHub username"`
```html
<input type="text" id="input-search" placeholder="Enter the GitHub username">
```
**Purpose:** Provides a short hint about the expected value in the input field.

**Benefit:** Gives additional guidance to all users, although it should not replace the explicit label for accessibility purposes.<br><br>

### ✅ `type="submit"`
```html
<button type="submit" id="btn-search">Search</button>
```
**Purpose:** Specifies that the button submits the form.

**Benefit:** Screen readers announce it as a submit action, ensuring users understand its functionality.<br><br>

### ✅ `role="region"`
```html
<div class="profile-data hidden" role="region" aria-live="polite">
```
**Purpose:** Marks this container as a significant content region.

**Benefit:** Screen readers can recognize and navigate to this section as a standalone, meaningful block.<br><br>

### ✅ `aria-live="polite"`
```html
<div class="profile-data hidden" role="region" aria-live="polite">
```
**Purpose:** Informs assistive technologies that the content inside may change dynamically.

**Benefit:** Updates are announced to users without interrupting their current task, ideal for asynchronous API results.<br><br>

### ✅ class="hidden"
```html
<div class="profile-data hidden" role="region" aria-live="polite">
```
**CSS Block:**
```css
.hidden {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
}
```

**Purpose:** Keep the live region present in the DOM (and in the accessibility tree) but fully *non-visual* and *non-interactive* until there is data to show.

**Explanation:**
- **`opacity: 0`** – Makes the region fully transparent (not visible).
- **`position: absolute`** – Removes it from normal flow so it doesn’t affect layout while hidden.
- **`width/height: 1px`** – Reduces its footprint to the smallest practical box.
- **`overflow: hidden`** – Ensures any content inside doesn’t spill visually.
- **`pointer-events: none`** – Prevents mouse interaction while hidden.

**Why *not* `display: none` or `visibility: hidden`?**

Because this is an **ARIA live region**. Using `display: none` (or sometimes `visibility: hidden`) removes the node from many assistive technology trees, which can suppress announcements. Your approach keeps the region alive for screen readers while it’s visually hidden, so updates can be announced when it becomes visible.

**How this aligns with the JavaScript flow:**
- On load, the container has the `hidden` class, making it invisible and non-interactive—no empty box or “blank region” is announced by assistive technologies.
- In `screen.renderUser(...)`, the profile markup is injected, and then `this.userProfile.classList.remove('hidden')` is called.

&nbsp;&nbsp; → The region becomes visible right after content is inserted; with `aria-live="polite"`, assistive tech can announce the new content without disrupting the user.

- In `screen.renderRepo(...)`, subsequent DOM updates (repo counter, carousel, buttons) occur in the same live region and are announced politely when appropriate.<br><br>

---

## 🎨 CSS Styling (reset.css & style.css)

### `reset.css`

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

a {
    text-decoration: none;
}

ul {
    list-style: none;
}

img {
    max-width: 100%;
}
```

**Purpose:** This file resets default browser styles to ensure consistency across all browsers. It removes default margins, paddings, and other inconsistent styles applied by browsers.

**Benefit:** By using `reset.css`, developers can build layouts without unexpected spacing or formatting issues, achieving a predictable base for styling.<br><br>

### `style.css`

```css
body {
    font-family: "Kumbh Sans", sans-serif;
    background-color: #222;
    color: #fff;
    padding-bottom: 100px;
}
```

**Purpose:** Sets the main font, background color, text color, and bottom padding for the page.

**Benefit:** Creates a consistent visual style and spacing for the entire page, improving readability and aesthetics.<br><br>

```css
:root {
    --grey: #b9b9b9;
    --yellow: rgb(255, 237, 43);
    --black: #222;

    --preview-h-lg: 328px;
    --preview-w-lg: 432px;
}
```

**Purpose:** Defines global CSS variables for colors and preview dimensions.

**Benefit:** Allows consistent use of colors and sizes throughout the project and simplifies maintenance and theming.<br><br>

```css
label {
    font-size: 1.25rem;
    font-weight: 500;
}
```

**Purpose:** Styles form labels with larger text and medium weight.

**Benefit:** Improves readability and visual hierarchy of form elements.<br><br>

```css
main,
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

**Purpose:** Applies a flex container to center content vertically and horizontally in column layout.

**Benefit**: Simplifies layout structure and ensures consistent alignment of child elements.<br><br>

```css
i {
    margin: 1.5em 0 .25em;
    font-size: 4rem;
}
```

**Purpose:** Styles the GitHub icon with spacing and size.

**Benefit:** Enhances visual emphasis and alignment for the icon.<br><br>

```css
h1,
label {
    margin-bottom: 1em;
}
```

**Purpose:** Adds spacing below headings and labels.

**Benefit:** Improves layout readability and separates elements visually.<br><br>

```css
.container {
    background-color: #fff;
    color: var(--black);
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    justify-content: center;
    align-items: center;
    padding: 1em;
}
```

**Purpose:** Styles the main container with background, text color, rounded corners, width constraints, and padding.

**Benefit:** Provides a visually distinct, centered content box with good spacing and rounded corners for a modern look.<br><br>

```css
button {
    cursor: pointer;
    border-radius: 20px;
    border: none;
}
```

**Purpose:** Styles buttons with rounded corners, removes borders, and sets a pointer cursor.

**Benefit:** Improves usability and visual appeal for interactive elements.<br><br>

```css
form label,
form input,
form button {
    display: block;
}
```

**Purpose:** Makes form elements block-level for vertical stacking.

**Benefit:** Ensures proper spacing and alignment of form elements.<br><br>

```css
#btn-search {
    font-weight: bold;
    padding: .75em 2.75em;
    margin: 2em auto 0;
    background-color: var(--grey);
}
```

**Purpose:** Styles the search button with padding, bold text, centered margin, and background color.

**Benefit:** Makes the search button visually prominent and easy to identify.<br><br>

```css
.btn-arrow {
    background-color: var(--yellow);
    color: var(--black);
    width: 110px;
    font-size: .85rem;
    padding: .5em .5em;
    margin: 0 .35em;
}
```

**Purpose:** Styles arrow buttons used for repository navigation.

**Benefit:** Makes navigation buttons visually clear and consistent in size and color.<br><br>

```css
form {
    width: 100%;
    text-align: center;
}
```

**Purpose:** Centers form elements and sets form width.

**Benefit:** Ensures inputs and buttons are visually aligned within the container.<br><br>

```css
input {
    width: 90%;
    padding: .75em;
    margin: 0 auto;
    border: 1px solid var(--grey);
    border-radius: 20px;
    box-shadow: 0 2px 5px rgb(205, 205, 205);
}

input:hover,
input:focus {
    outline: none;
    box-shadow: 0 4px 10px rgb(205, 205, 205);
}
```

**Purpose:** Styles input fields with width, padding, border, rounded corners, and shadow; adds hover/focus effects.

**Benefit:** Enhances usability, interactivity, and visual consistency of form inputs.<br><br>

```css
#btn-search:is(:hover, :focus) {
    font-weight: bolder;
    color: #fff;
    background-color: rgb(106, 106, 106);
}
```

**Purpose:** Adds hover and focus effects to the search button.

**Benefit:** Provides visual feedback, improving user experience.<br><br>

```css
.hidden {
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    pointer-events: none;
}
```

**Purpose:** Hides elements visually while keeping them accessible to screen readers.

**Benefit:** Supports accessibility and avoids layout disruption for hidden content.<br><br>

```css
.container div.profile-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2em 0;
}
```

**Purpose:** Styles profile data container with column flex layout.

**Benefit:** Organizes profile content vertically and centers it for better readability.<br><br>

```css
.container div.profile-data div.info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1em;
}
```

**Purpose:** Displays profile info flexibly with wrapping and centered alignment.

**Benefit:** Ensures proper layout of avatar and text across different screen sizes.<br><br>

```css
.container div.profile-data div.info img.avatar {
    width: 50%;
    border-radius: 50%;
    border: 10px solid var(--yellow);
    margin-bottom: 1.25em;
}
```

**Purpose:** Styles the avatar image with circular shape, border, and spacing.

**Benefit:** Creates a visually appealing, highlighted profile picture.<br><br>

```css
.container div.profile-data div.info div.data h2,
.container div.profile-data div.info div.data p {
    text-align: center;
    margin-bottom: .5em;
}
```

**Purpose:** Centers name and bio text with spacing.

**Benefit:** Improves readability and visual hierarchy of profile information.<br><br>

```css
.container div.repositories {
    width: 100%;
    text-align: center;
    padding: 1em;
    background-color: var(--black);
    color: #fff;
    border-radius: 10px;
}
```

**Purpose:** Styles repository section with background, text color, padding, and rounded corners.

**Benefit:** Visually separates repositories and provides a clean, readable layout.<br><br>

```css
.container div.repositories h2,
.container div.repositories p.repo-counter,
.container div.repositories div.carousel img.preview-page,
.container div.repositories div.carousel h3 {
    margin-bottom: 1em;
}
```

**Purpose:** Adds spacing below repository section elements.

**Benefit:** Prevents clutter and improves content readability.<br><br>

```css
#repo-link {
    color: #fff;
    text-decoration: underline;
}
```

**Purpose:** Styles repository links with color and underline.

**Benefit:** Ensures links are identifiable and consistent with theme.<br><br>

```css
.container div.repositories div.repo-btn-container {
    display: flex;
    justify-content: space-around;
}
```

**Purpose:** Arranges repository navigation buttons horizontally with spacing.

**Benefit:** Improves user experience for carousel navigation.<br><br>

```css
.image-loader {
    height: 318.5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loader {
    box-sizing: border-box;
    width: 15%;
    aspect-ratio: 1/1;
    min-width: 100px;
    border: 20px solid #f3f3f3;
    border-top: 1em solid purple;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
```

**Purpose:** Creates a loading spinner for repository previews.

**Benefit:** Provides visual feedback while content is loading, improving UX.<br><br>

```css
@media (min-width: 500px) { ... }
@media (min-width: 900px) { ... }
```

**Purpose:** Applies responsive design for larger screens, adjusting sizes, layout, and spacing.

**Benefit:** Ensures the interface is usable and visually appealing on all devices, from mobile to desktop.<br><br>

---

## 💡 JavaScript Files Documentation (index.js & Modules)

### `index.js`

```js
import { getUser } from './services/users.js';
```

**Purpose:** Import the `getUser` function to fetch GitHub user data.

**Benefit:** Enables modular code by separating API calls from UI logic.<br><br>

```js
import { getRepos } from './services/repositories.js';
```

**Purpose:** Import the `getRepos` function to fetch repositories of a user.

**Benefit:** Provides access to a user's repository data in a structured way.<br><br>

```js
import { userObj } from './objects/user.js';
```

**Purpose:** Import the `userObj` object to store user and repository data.

**Benefit:** Centralizes state management for user data.<br><br>

```js
import { screen } from './objects/screen.js';
```

**Purpose:** Import the `screen` object to handle DOM rendering.

**Benefit:** Separates rendering logic from data logic for cleaner code.<br><br>

```js
import { setCurrentUsername, setCurrentRepo } from './global.js';
```

**Purpose:** Import functions to manage global state of the current username and repository index.

**Benefit:** Ensures consistent state management across the app.<br><br>

```js
import { formatHttpError } from './utils/formatHttpError.js';
```

**Purpose:** Import utility to format HTTP errors from API requests.

**Benefit:** Provides user-friendly error messages.<br><br>

```js
const inputSearch = document.getElementById('input-search');
```

**Purpose**: Select the search input element from the DOM.

**Benefit:** Enables reading the username entered by the user.<br><br>

#### 🔍 Trigger GitHub User Search

```js
function triggerSearch() {
    const userName = inputSearch.value.trim();
    if (userName) {
        setCurrentUsername(userName);
        setCurrentRepo(0);
        getUserData(userName);
    };
};
```

##### `function triggerSearch() {`

- **Purpose:** Defines a new function named `triggerSearch`.
- **Benefit:** Encapsulates the search logic so it can be reused whenever a search action is triggered.

##### `const userName = inputSearch.value.trim();`

- **Purpose:** Retrieves the current value from the search input field (`inputSearch`) and removes any leading or trailing whitespace using `trim()`.
- **Benefit:** Ensures that the username is clean and avoids unnecessary errors caused by extra spaces.

##### `if (userName) {`

- **Purpose:** Checks if `userName` is not an empty string or falsy value.
- **Benefit:** Prevents unnecessary API requests and errors when the input field is empty.

##### `setCurrentUsername(userName);`

- **Purpose:** Calls the `setCurrentUsername` function to update the global `currentUsername` variable with the input value.
- **Benefit:** Keeps track of the username currently being searched, which is used by other modules like repositories and carousel.

##### `setCurrentRepo(0);`

- **Purpose:** Resets the current repository index to `0` by calling `setCurrentRepo`.
- **Benefit:** Ensures that when a new user is searched, the repository carousel starts from the first repository.

##### `getUserData(userName)`

- **Purpose:** Calls the `getUserData` function, passing the entered username, to fetch the user and repository information from GitHub.
- **Benefit:** Initiates the API requests to retrieve and display the GitHub user's profile and repositories.<br><br>

#### 📨 Handle Search Form Submission

```js
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    triggerSearch();
});
```

##### `document.getElementById('search-form').addEventListener('submit', (event) => {`

- **Purpose:** Selects the form with id `search-form` and attaches a `submit` event listener that receives the event object.
-  **Benefit:** Captures both button clicks and *Enter* key submissions in one place, letting you customize what happens when the form is submitted.

##### `event.preventDefault();`

- **Purpose:** Cancel the browser's default form submission behavior (page reload + HTTP request).
- **Benefit:** Keeps the app on the same page so you can handle the submission with JavaScript (fetch data, update UI) without a full refresh.

##### `triggerSearch();`

- **Purpose:** Invoke the centralized search routine that reads input, sets state, and fetches user/repo data.
- **Benefit:** Reuses the same logic everywhere, ensuring consistent behavior and reducing code duplication.<br><br>

#### 🛰️ Fetch and Display GitHub User Profile & Repositories

```js
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
```

##### `async function getUserData(userName) {`

- **Purpose:** Defines an asynchronous function that accepts a GitHub username — the value previously captured in the `triggerSearch()` function from the search input and stored in its local `userName` variable — to retrieve and display the corresponding user and repository data from the GitHub API.
- **Benefit:** Allows use of `await` for cleaner, sequential async flow tied to a specific user.

##### `try {`

- **Purpose:** Starts a protected block for the user-fetch workflow.
- **Benefit:** Ensures network/parse failures are caught and handled gracefully.

##### `const userResponse = await getUser(userName);`

- **Purpose:** Calls the service that fetches the user profile from GitHub.
- **Benefit:** Retrieves the raw HTTP response needed to validate status and parse data.

##### `if (!userResponse.ok) {`

- **Purpose:** Checks whether the HTTP request succeeded.
- **Benefit:** Prevents attempting to parse or use a failed response.

##### `screen.renderError(formatHttpError(userResponse, 'User'));`

- **Purpose:** Builds a user-friendly error message and displays it in the UI.
- **Benefit:** Gives immediate feedback about why the user profile couldn't be loaded.

##### `return;`

- **Purpose:** Stops further execution when the user fetch fails.
- **Benefit:** Avoids cascading errors and unnecessary API calls.

##### `const userData = await userResponse.json();`

- **Purpose:** Parses the successful response body as JSON.
- **Benefit:** Converts the payload into a usable JavaScript object.

##### `userObj.setInfo(userData);`

- **Purpose:** Stores core user fields (avatar, name, bio, login) in the app's user object.
- **Benefit:** Centralizes state so the UI and other modules can access normalized user data.

##### `let repoData;`

- **Purpose:** Declares a variable to hold repositories data.
- **Benefit:** Makes the variable available across the nested try/catch and subsequent steps.

##### `try {`

- **Purpose:** Starts a protected block for the repositories-fetch workflow.
- **Benefit:** Separately handles repo-specific failures from user fetch errors.

##### `repoData = await getRepos(userName);`

- **Purpose:** Requests the list of public repositories for the user.
- **Benefit:** Gathers content needed to populate the carousel and counters.

##### `} catch (repoError) {`

- **Purpose:** Captures errors thrown while fetching repositories.
- **Benefit:** Enables tailored feedback specific to repository issues.


##### `screen.renderError(formatHttpError({ status: repoError.code || 500, url: '', ok: false }, 'Repositories'));`

- **Purpose:** Normalizes the error (even when it's a thrown object) and renders it.
- **Benefit:** Consistent, informative error messaging for repo failures.

##### `return;`

- **Purpose:** Terminates the function execution upon a repository fetch failure.
- **Benefit:** Prevents rendering with incomplete or undefined repo data.

##### `userObj.setRepositories(repoData);`

- **Purpose:** Persists the fetched repositories in the user object.
- **Benefit:** Makes repo data available for UI rendering and navigation.

##### `screen.renderUser(userObj);`

- **Purpose:** Renders the user profile section (avatar, name, bio).
- **Benefit:** Immediately shows the user's identity details in the UI.

##### `screen.renderRepo(userObj);`

- **Purpose:** Renders the repositories section, including carousel and controls.
- **Benefit:** Presents interactive repo previews and navigation to the user.

##### `} catch (err) {`

- **Purpose:** Catches any unexpected errors from the outer workflow.
- **Benefit:** Provides a final safety net for unanticipated failures.

##### `screen.renderError(formatHttpError({ status: 500, url: '', ok: false }, 'Request'));`

- **Purpose:** Displays a generic "request" error when the exact cause is unknown.
- **Benefit:** Ensures the UI always communicates that something went wrong.<br><br>

### `users.js`

#### 🔍 Fetch GitHub User Data (`getUser`)

```js
async function getUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    
    return response;
};

export { getUser };
```

##### `async function getUser(userName) {`

- **Purpose:** Declares an asynchronous function that takes a GitHub username as its parameter.
- **Benefit:** Enables the use of `await` inside the function and clearly scopes the username input for the API call.

##### `const response = await fetch('https://api.github.com/users/${userName}');`

- **Purpose:** Sends an HTTP GET request to the GitHub Users API endpoint for the provided `userName`, waiting for network response.
- **Benefit:** Retrieves the raw `Response` object from GitHub, allowing the caller to decide how to handle status codes and when/if to parse JSON.

##### `return response;`

- **Purpose:** Returns the `Response` object to the caller.
- **Benefit:** Keeps the function focused on fetching only, giving upstream code full control over error handling (`response.ok`) and data extraction (`response.json()`).

##### `export { getUser };`

- **Purpose:** Exports `getUser` as a named export from the module.
- **Benefit:** Makes the function importable elsewhere (`import { getUser } from './services/users.js';`), promoting modularity and reuse.<br><br>

### `repositories.js`

#### 🔍 Fetch GitHub Repositories by Username

```js
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
```

##### `import { formatHttpError } from '../utils/formatHttpError.js';`

- **Purpose:** Imports the `formatHttpError` utility to handle API errors.
- **Benefit:** Centralizes error formatting and ensures consistent error messages throughout the application.

##### `async function getRepos(userName) {`

- **Purpose:** Defines an asynchronous function `getRepos` that accepts a GitHub username as an argument.
- **Benefit:** Enables the function to perform asynchronous operations, like fetching repository data from the GitHub API.

##### `const response = await fetch('https://api.github.com/users/${userName}/repos');`

- **Purpose:** Makes a `fetch` request to GitHub's API endpoint to retrieve the repositories of the specified user.
- **Benefit:** Retrives the user's repository data in real time for dynamic display in the application.

##### `if (!response.ok) throw formatHttpError(response, 'Repositories');`

- **Purpose:** Checks if the API response indicates an error (non-OK HTTP status).
- **Benefit:** Ensures proper error handling by throwing a formatted error if the request fails, improving reliability and user feedback.

##### `const repos = await response.json();`

- **Purpose:** Converts the API response from JSON format into a JavaScript object/array.
- **Benefit:** Makes the repository data usable in the application for rendering and manipulation.

##### `if (repos.length === 0) {`

- **Purpose:** Checks if the returned repository array is empty.
- **Benefit:** Provides a safeguard against displaying an empty carousel or list when a user has no repositories.

##### `throw formatHttpError({ status: 404, url: 'https://api.github.com/users/${userName}/repos' }, 'Repositories')`

- **Purpose:** Throws a custom formatted error indicating that no repositories were found.
- **Benefit:** Provides clear feedback to the user when a GitHub account exists but has no repositories, maintaining consistent error messaging.

##### `return repos;`

- **Purpose:** Returns the repository data array to the caller.
- **Benefit:** Allows other modules (like `screen.js`) to access and display the repository information dynamically.

##### `export { getRepos };`

- **Purpose:** Exports the `getRepos` function for use in other modules.
- **Benefit:** Makes this module reusable and keeps the code organized with modular imports/exports.
