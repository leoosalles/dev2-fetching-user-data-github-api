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

### `global.js`

#### 🌍 Global State Manager

```js
export let currentUsername = "";
export let currentRepo = 0;

export function setCurrentUsername(username) {
    currentUsername = username;
};

export function setCurrentRepo(repo) {
    currentRepo = repo;
};
```

##### `export let currentUsername = "";`

- **Purpose:** Declares and exports a mutable module-level variable named `currentUsername`, initialized to an empty string.
- **Benefit:** Serves as a single source of truth for the username currently being searched; because it is exported, other modules can read this value (they will see updates thanks to ES module live bindings).

##### `export let currentRepo = 0;`

- **Purpose:** Declares and exports a mutable module-level variable named `currentRepo`, initialized to `0`;
- **Benefit:** Tracks the index of the currently selected repository (used by the carousel); exporting it lets other modules read the current index without passing it through function arguments.

##### `export function setCurrentUsername(userName) {`

- **Purpose:** Exports a function named `setCurrentUsername` that accepts a `username` parameter.
- **Benefit:** Provides a single, explicit API to update `currentUsername` from other modules, improving encapsulation and making state changes intentional and easy to audit.

##### `currentUsername = username;`

- **Purpose:** Assigns the provided `username` value, passed as an argument to this function, to the `currentUsername` variable.
- **Benefit:** Updates the shared state so all modules that consume `currentUsername` (via import) see the new value immediately due to ES module live bindings.

##### `export function setCurrentRepo(repo) {`

- **Purpose:** Exports a function named `setCurrentRepo` that accepts a `repo` parameter (an index).
- **Benefit:** Offers a controlled way to change the `currentRepo` index, avoiding ad-hoc mutations and making intent explicit when navigating repositories.

##### `currentRepo = repo;`

- **Purpose:** Assigns the provided `repo` value to the current `currentRepo` variable.
- **Benefit:** Updates the globally shared repository index so UI modules (carousel, screen) will act on the new index consistently.<br><br>

### `services/users.js`

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
- **Benefit:** Enables the use of `await` inside the function and clearly scopes the username input for the API call.<br><br>

```js
const response = await fetch(`https://api.github.com/users/${userName}`);
```

- **Purpose:** Sends an HTTP GET request to the GitHub Users API endpoint for the provided `userName`, waiting for network response.
- **Benefit:** Retrieves the raw `Response` object from GitHub, allowing the caller to decide how to handle status codes and when/if to parse JSON.

##### `return response;`

- **Purpose:** Returns the `Response` object to the caller.
- **Benefit:** Keeps the function focused on fetching only, giving upstream code full control over error handling (`response.ok`) and data extraction (`response.json()`).

##### `export { getUser };`

- **Purpose:** Exports `getUser` as a named export from the module.
- **Benefit:** Makes the function importable elsewhere (`import { getUser } from './services/users.js';`), promoting modularity and reuse.<br><br>

### `services/repositories.js`

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
- **Benefit:** Enables the function to perform asynchronous operations, like fetching repository data from the GitHub API.<br><br>

```js
const response = await fetch(`https://api.github.com/users/${userName}/repos`);
```

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
- **Benefit:** Provides a safeguard against displaying an empty carousel or list when a user has no repositories.<br><br>

```js
throw formatHttpError({ status: 404, url: `https://api.github.com/users/${userName}/repos` }, 'Repositories')
```

- **Purpose:** Throws a custom formatted error indicating that no repositories were found.
- **Benefit:** Provides clear feedback to the user when a GitHub account exists but has no repositories, maintaining consistent error messaging.

##### `return repos;`

- **Purpose:** Returns the repository data array to the caller.
- **Benefit:** Allows other modules (like `screen.js`) to access and display the repository information dynamically.

##### `export { getRepos };`

- **Purpose:** Exports the `getRepos` function for use in other modules.
- **Benefit:** Makes this module reusable and keeps the code organized with modular imports/exports.<br><br>

### `utils/formatHttpError.js`

#### 🛑 HTTP Error Formatter

```js
function formatHttpError(response, context = 'Request') {
    const { status, url } = response;

    let message;

    switch (status) {
        case 404:
            message = getNotFoundMessage(context);
            break;
        case 403:
            message = "🚫 Access denied. You may have exceeded GitHub's request limit.";
            break;
        case 500:
            message = "💥 Internal server error. Please try again later.";
            break;
        default:
            message = "⚠️ An unexpected error occurred. Please check your connection or try again.";
    }

    return {
        code: status,
        message,
        url,
        context,
        fullMessage: `${context} failed with status ${status}: ${message} [URL: ${url}]`
    };
};

function getNotFoundMessage(context) {
    switch (context) {
        case 'User':
            return "😢 User not found. Please check the user name and try again.";
        case 'Repositories':
            return "📭 No repositories found for this user.";
        case 'Image':
            return "🖼️ Unable to display repository image.";
        default:
            return "🔍 Resource not found.";
    };
};

export { formatHttpError };
```

##### `function formatHttpError(response, context = 'Request') {`

- **Purpose:** Declares a function named `formatHttpError` that accepts an HTTP `response` object and an optional `context` string (defaulting to '`Request`').
- **Benefit:** Encapsulates error-normalization logic in one place so every module can convert raw HTTP responses into consistent, user-friendly error objects.

##### `const { status, url } = response;`

- **Purpose:** Destructures the `status` and `url` properties from the provided `response` object.
- **Benefit:** Makes HTTP status code and request URL directly available with concise names for use in error messages logic.

##### `let message;`

- **Purpose:** Declares a `message` variable that will hold the human-readable error text.
- **Benefit** Prepares a single place to assign context-specific messages that will be returned to the caller.

##### `switch (status) {`

- **Purpose:** Starts a `switch` statement to set `message` based on the HTTP status code.
- **Benefit:** Provides a clear and scalable structure for mapping status codes to user-facing messages.

##### `case 404:`

- **Purpose:** Handles the `404 Not Found` HTTP status.
- **Benefit:** Allows the function to return a precise, helpful message when a requested resource doesn't exist.

##### `message = getNotFoundMessage(context);`

- **Purpose:** Sets `message` by calling `getNotFoundMessage` with the current `context`.
- **Benefit:** Produces a context-aware "not found" message (e.g., different phrasing for missing users vs. missing repositories).

##### `break;`

- **Purpose:** Exits the `case 404` branch.
- **Benefit:** Prevents fall-through to subsequent cases, keeping logic correct and predictable.

##### `case 403:`

- **Purpose:** Handles the `403 Forbidden` HTTP status.
- **Benefit:** Captures authorization/rate-limit scenarios separately so users get actionable feedback.

##### `message = "🚫 Access denied. You may have exceeded GitHub's request limit.";`

- **Purpose:** Assigns a clear message explaining the likely reason
 for a `403`.
- **Benefit:** Informs users about rate-limiting or permission issues and helps them understand next steps.

##### `break;`

- **Purpose:** Exits the `case 403` branch.
- **Benefit:** Keeps the switch-flow isolated for each status code.

##### `case 500:`

- **Purpose:** Handles the `500 Internal Server Error` HTTP status.
- **Benefit:** Differentiates server-side failures from client-side issues.

##### `message = "💥 Internal server error. Please try again later.";`

- **Purpose:** Provides a user-facing message for server errors.
- **Benefit:** Sets appropriate expectations (this is a server problem, not a client mistake).

##### `break;`

- **Purpose:** Exits the `case 500` branch.
- **Benefit:** Prevents unintended fall-through.

##### `default:`

- **Purpose:** Provides a fallback for any other status codes not explicitly handled above.
- **Benefit:** Ensures every possible response yields a sensible message instead of leaving `message` undefined.

##### `message = "⚠️ An unexpected error occurred. Please check your connection or try again.";`

- **Purpose:** Assigns a generic message for unknown errors.
- **Benefit:** Gives users a helpful, non-technical prompt when the cause is unclear.<br><br>

```js
return { code: status, message, url, context, fullMessage: `${context} failed with status ${status}: ${message} [URL: ${url}]` };
```

- **Purpose:** Returns a standardized error object containing:
  - `code`: the HTTP status,
  - `message`: the user-friendly text,
  - `url`: the request URL,
  - `context`: the functional area (e.g., 'User' or 'Repositories'),
  - `fullMessage`: a detailed diagnostic string for logs or debugging.
- **Benefit:** Provides both UI-friendly and developer-friendly information in a single consistent structure that callers can render or log as needed.

##### `function getNotFoundMessage(context) {`

- **Purpose:** Declares a helper function to produce context-sensitive "not found" messages.
- **Benefit:** Centralizes variations of 404 messaging so wording is consistent and easy to maintain.

##### `switch (context) {`

- **Purpose:** Executes different logic depending on the value of the `context` argument.
- **Benefit:** Enables different messages for different parts of the app (user vs. repositories vs. images).

##### `case 'User':`

- **Purpose:** Handles the case where the missing resource is a GitHub user.
- **Benefit:** Allows a tailored message that directly tells the user the username isn't found.

##### `return "😢 User not found. Please check the user name and try again.";`

- **Purpose:** Returns a friendly 404 message specific to users.
- **Benefit:** Improves UX by suggesting the likely corrective action (check the username).

##### `case 'Repositories':`

- **Purpose:** Handles the case where the missing resource is a repository list.
- **Benefit:** Enables a different tone and information for a repositories-related 404.

##### `return "📭 No repositories found for this user.";`

- **Purpose:** Returns a clear message indicating no repositories exist for that account.
- **Benefit:** Prevents confusion between a non-existent user and a user who simply has no repositories.

##### `case 'Image':`

- **Purpose:** Handles the case where a preview image couldn't be retrieved.
- **Benefit:** Allows a message focused on preview/image failures rather than data fetching.

##### `return "🖼️ Unable to display repository image.";`

- **Purpose:** Returns a short explanation about image preview failure.
- **Benefit:** Keeps users informed when only the visual preview is unavailable while links/data may still be present.

##### `default:`

- **Purpose:** Fallback when `context` is not recognized.
- **Benefit:** Ensures the function always returns a meaningful string.

##### `return "🔍 Resource not found.";`

- **Purpose:** Returns a generic "not found" message for unknown contexts.
- **Benefit:** Maintains consistent behavior even if new contexts are introduced without updating this helper.

##### `export { formatHttpError };`

- **Purpose:** Exports `formatHttpError` as a named export from this module.
- **Benefit:** Allows other modules (services, screen rendering etc.) to import and reuse a single, consistent error-formatting utility.<br><br>

### `objects/user.js`

#### 🧑‍💻 User Profile Data Model

```js
const userObj = {
    avatarUrl: '',
    name: '',
    bio: '',
    userName: '',
    repositories: [],
    setInfo(gitHubUser) {
        this.avatarUrl = gitHubUser.avatar_url;
        this.name = gitHubUser.name;
        this.bio = gitHubUser.bio;
        this.userName = gitHubUser.login;
    },
    setRepositories(repositories) {
        this.repositories = repositories;
    }
};

export { userObj };
```

##### `const userObj = {`

- **Purpose:** Declares a single, named object (`userObj`) that will hold user-related state and methods.
- **Benefit:** Provides a centralized container for profile data and related behavior, simplifying access and updates across the app.

##### `avatarUrl: '',`

- **Purpose:** Reserves a string property to store the user's avatar URL (initially empty).
- **Benefit:** Establishes a predictable field for rendering profile images; avoids undefined checks when the UI reads this property.

##### `name: '',`

- **Purpose:** Reserves a string property to store the user's display name.
- **Benefit:** Keeps the user's readable name in a single place for UI rendering and avoids scattered data access.

##### `bio: '',`

- **Purpose:** Reserves a string property to store the user's biography or description.
- **Benefit:** Ensures the profile text is available in a consistent field for presentation and accessibility.

##### `userName: '',`

- **Purpose:** Reserves a string property to store the user's GitHub login (username).
- **Benefit:** Distinguishes the login identifier from the display name and allows other modules (e.g., URL builders) to reference the exact login.

##### `repositories: [],`

- **Purpose:** Reserves an array property to hold the user's repository list (initially empty).
- **Benefit:** Provides a predictable place to store repo data for the carousel and other UI components, avoiding type checks before iteration.

##### `setInfo(gitHubUser) {`

- **Purpose:** Defines a method that accepts a GitHub API user object and maps its fields into the `userObj`.
- **Benefit:** Encapsulates the mapping logic in one place, normalizing external API data to the app's internal shape and making future changes easy.

##### `this.avatarUrl = gitHubUser.avatar_url;`

- **Purpose:** Assigns the `avatar_url` value from the GitHub API response to the object's `avatarUrl` property.
- **Benefit:** Converts the API's snake_case naming to the app’s camelCase convention, ensuring consistency and keeping the object updated for UI consumption.

##### `this.name = gitHubUser.name;`

- **Purpose:** Assigns the `name` value from the GitHub API response to the object's `name` property.
- **Benefit:** Stores the human-readable name centrally so rendering logic simply reads `userObj.name`.

##### `this.bio = gitHubUser.bio;`

- **Purpose:** Assigns the `bio` value from the GitHub API response to te object's `bio` property.
- **Benefit:** Preserves the user's description for immediate display and for any accessibility announcements.

##### `this.userName = gitHubUser.login;`

- **Purpose:** Assigns the `login` value (the GitHub handle) from the GitHub API response to the object's `userName` property.
- **Benefit:** Keeps both display name and login available separately (useful for building URLs, previews, and consistent state).

##### `setRepositories(repositories) {`

- **Purpose:** Defines a method that accepts an array of repositories and assigns it to the object.
- **Benefit:** Centralizes repository assignment so the UI and other modules always read from a single, updated source.

##### `this.repositories = repositories;`

- **Purpose:** Replaces the `repositories` array on the object with the fetched array.
- **Benefit:** Ensures the object holds the latest repo data for rendering, pagination, and carousel logic without replacing the object reference.

##### `export { userObj };`

- **Purpose:** Exports `userObj` as a named export from the module.
- **Benefit:** Provides other modules with a live reference to the same object; when `userObj` properties are updated via its methods, all importers observe the changes without needing to re-import or reassign values.<br><br>

### `objects/screen.js`

#### 🖥️ Screen Renderer & Error Handler Module

```js
import { currentRepo, setCurrentRepo } from '../global.js';
```

**Purpose:** Imports the shared carousel index and its setter from the global state module.

**Benefit:** Enables this module to read/update which repository is currently shown without duplicating state.<br><br>

```js
import { updateRepoView } from '../utils/carousel.js';
```

**Purpose:** Imports the function that renders a single repository preview into the carousel.

**Benefit:** Keeps rendering logic modular and reusable, reducing code repetition.<br><br>

```js
import { formatHttpError } from '../utils/formatHttpError.js';
```

**Purpose:** Imports a helper to normalize HTTP error objects/messages.

**Benefit:** Ensures consistent, user-friendly error feedback across the UI.<br><br>

```js
let userDataEl = document.querySelector('.profile-data');
```

**Purpose:** Cache the container element where profile/repo content will be injected.

**Benefit:** Minimizes repeated DOM queries and improves performance/readability.

```js
const screen = {
```

**Purpose:** Defines a UI controller object responsible for updating the view.

**Benefit:** Centralizes all DOM rendering concerns behind a simple API.<br><br>

```js
userProfile: userDataEl,
```

**Purpose:** Stores the target DOM node on the controller for easy access.

**Benefit:** Simplifies method implementations by avoiding re-querying the DOM.<br><br>

#### 👤✨ Render User Profile Method

```js
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
```

##### `renderUser(userObj) {`

- **Purpose:** Declares a method to render the user's profile section.
- **Benefit:** Separates profile rendering from data gathering, improving cohesion.

##### `this.userProfile.innerHTML = \ …HTML template… ;`

- **Purpose:** Injects markup showing avatar, display name (with fallback), and bio (with fallback).
- **Benefit:** Produces an accessible, consistently formatted profile view, even when fields are missing.

##### `this.userProfile.classList.remove('hidden');`

- **Purpose:** Makes the profile container visible after injecting content.
- **Benefit:** Prevents empty/flashy UI; only shows section when data exists.<br><br>

#### 📂🎠 Render Repositories Carousel Method

```js
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
```

##### `renderRepo(userObj) {`

- **Purpose:** Declares a method that receives the populated `userObj`.
- **Benefit:** Centralizes the UI logic to display repositories for the current user.

##### `if (!Array.isArray(userObj.repositories) || userObj.repositories.length === 0) {`

- **Purpose:** Ensures that `userObj.repositories` is a valid array with content before proceeding. The condition `!Array.isArray(userObj.repositories)` checks whether the `repositories` property is not an array, while `userObj.repositories.length === 0` verifies if the array is empty. Together, these checks act as a guard clause to detect missing or empty repository data.
- **Benefit:** By using `!Array.isArray(...) || ...length === 0`, the code avoids runtime errors and ensures a smooth user experience. Instead of breaking or displaying incorrect data, the UI can gracefully handle the absence of repositories. This makes the application more robust and user-friendly.

##### `this.userProfile.insertAdjacentHTML('beforeend', …HTML template…);`

- **Purpose:** Appends a structured "Repositories" section to the user profile whenn no repositories are available. The method `insertAdjacentHTML('beforeend', …)` injects a `<div>` containing a heading, a repository counter set to zero, and an alert message into the end of the `this.userProfile` element.

- **Benefit:** Allows the interface to gracefully handle empty data states by clearly informing the user that no repositories were found. By using `insertAdjacentHTML`, the HTML is inserted efficiently without disrupting existing profile content. The semantic use of `<h2>` and `role="alert"` improves accessibility, while the layout remains consistent and informative even when data is missing.

##### `return;`

- **Purpose:** Exits early when there are no repositories.
- **Benefit:** Prevents unnecessary processing and avoids setting up events or rendering logic that would have no effect.

##### `let repoInfo = …HTML template…`

- **Purpose:** Defines a structured HTML block for displaying repository data when available. It includes a heading, a dynamic repository count, a carousel placeholder, and navigation buttons.
- **Benefit:** Enables efficient DOM insertion using `insertAdjacentHTML`, preserves readability and performance, ensures accessibility, and sets up the layout for interactive repository navigation.

##### `this.userProfile.insertAdjacentHTML('beforeend', repoInfo);`

- **Purpose:** Integrates the repositories interface into the user's profile area in a seamless and efficient manner, enabling immediate display of interactive elements upon data load or update. It is executed only if the repository contains at least one item, as determined by the preceding `if` statement.
- **Benefit:** Avoids a full-render of the profile component, improving script performance and ensuring a smoother user experience. This approach also allows incremental UI updates while preserving the current state of the page. By conditionally injecting the UI only when relevant data exists, the script maintains a clean and purposeful DOM structure.

##### `updateRepoView(userObj.repositories[currentRepo]);`

- **Purpose:** Renders the preview for the currently selected repository.
- **Benefit:** Immediately shows content instead of an empty carousel.

##### `document.getElementById('btn-next').onclick = () => {`

- **Purpose:** Attaches a click handler to the "next" button.
- **Benefit:** Enables interactive navigation.

##### `let nextIndex = (currentRepo + 1) % userObj.repositories.length;`

- **Purpose:** Calculates the index of the next repository in the list when the "Next" button is clicked. This line uses modular arithmetic to increment the current index (`currentRepo`) by one and wrap around to the beginning of the array if the end is reached. The result is stored in `nextIndex`, which is then used to update the repository view.
- **Benefit:** Enables seamless circular navigation through the user's repositories without causing out-of-bounds errors. By using the modulo operator (`%`) with `userObj.repositories.length`, the logic ensures that once the last repository is reached, the next click cycles back to the first item. This creates a smooth and intuitive carousel experience for the user, regardless of how many repositories are available.

##### `setCurrentRepo(nextIndex);`

- **Purpose:** Stores the updated index in the shared state to reflect the current repository.
- **Benefit:** Ensures the carousel maintains its correct position when navigating or re-rendering.

##### `updateRepoView(userObj.repositories[nextIndex]);`

- **Purpose:** Updates the carousel display to show the newly selected repository.
- **Benefit:** Provides instant visual confirmation of the user's navigation action.

##### `document.getElementById('btn-previous').onclick = () => {`

- **Purpose:** Attaches a click handler to the "previous" button.
- **Benefit:** Enables backward navigation.

##### `let prevIndex = (currentRepo - 1 + userObj.repositories.length) % userObj.repositories.length;`

- **Purpose:** Calculates the index of the previous repository in the list when the "Previous" button is clicked. This line uses modular arithmetic to decrement the current index (`currentRepo`) by one and wrap around to the last item if the current index is at the last item if the current index is at the beginning of the array. The result is stored in `prevIndex`, which is then used to update the repository view.
- **Benefit:** Enables smooth circular navigation through the user's repositories without causing out-of-bounds errors. By adjusting the index with `- 1 + userObj.repositories.length` before applying the modulo operator, the logic ensures that negative values are normalized and wrapped correctly. This allows the carousel to cycle back to the last repository when the user navigates backward from the first item, maintaining a consistent and intuitive user experience.

##### `setCurrentRepo(prevIndex);`

- **Purpose:** Stores the previous index in shared state.
- **Benefit:** Ensures the carousel remains synchronized for future interactions.

##### `updateRepoView(userObj.repositories[prevIndex]);`

- **Purpose:** Re-renders the carousel with the previously selected repository.
- **Benefit:** Instantly displays the selected repository.<br><br>

#### ⚠️ Centralized Error Display

```js
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
```

##### `renderError(response, context = 'Request') {`

- **Purpose:** Handles and displays error messages in the UI based on the type of failure encountered during a request.
- **Benefit:** Provides a centralized and consistent way to surface errors to the user, improving clarity and user experience.

##### `const error = (response && response.message && response.code !== undefined) ? response : formatHttpError(response, context);`

- **Purpose:** Normalizes the error: if `response` already has `message` and `code`, use it; otherwise, converts the raw response into a standardized error via `formatHttpError`.
- **Benefit:** Guarantees a consistent error shape `({ code, message, url, context, ... })` for rendering, reducing conditional logic elsewhere.

##### `let container;`

- **Purpose:** Declares a variable to hold the target DOM where the error will be rendered.
- **Benefit:** Enables selecting different UI regions dynamically based on error type.

##### `switch (error.context) {`

- **Purpose:** Chooses where to render the error based on its context.
- **Benefit:** Displays the error message exactly in the section of the interface that corresponds to the nature of the error, making it easier for users to identify and resolve the issue.

##### `case 'User':`

- **Purpose:** Iniciates the switch branch for errors with a `context` value of `'User'`.
- **Benefit:** Clearly separates user-related error handling from other error types so the logic is explicit and maintainable.

##### `container = this.userProfile;`

- **Purpose:** Assigns the profile DOM node to the `container` variable, ensuring that any UI updates related to user errors are applied to the correct section of the interface.

##### `break;`

- **Purpose:** Terminates the `switch` statement after executing the `'User'` case.
- **Benefit:** Prevents fall-through into subsequent cases, avoiding unintended logic execution or accidental overrides of the `container` variable.

##### `case 'Repositories':`

- **Purpose:** Initiates the switch branch for errors with a `context` value of `'Repositories'`.
- **Benefit:** Isolates repository-related error handling, allowing issues tied to repository data or UI to be managed separately from other error types.

##### `container = document.querySelector('.carousel') || this.userProfile;`

- **Purpose:** Attempts to assign the `.carousel` DOM node to `container`; if not found, falls back to the user profile node (`this.userProfile`).
- **Benefit:** Ensures that repository-related errors are displayed directly in the section where the carousel is intended to render. If the carousel element is not present, it safely falls back to the profile area to prevent null reference errors and guarantee that the message is still visible.

##### `break;`

- **Purpose:** Terminates the `switch` statement after executing the `'Repositories'` case.
- **Benefit:** Prevents fall-through into subsequent cases, avoiding unintended logic execution or accidental overrides of the `container` variable.

##### `case 'Image':`

- **Purpose:** Initiates the switch branch for errors with a `context` value of `'Image'`.
- **Benefit:** Allows image-specific errors (e.g., preview rendering failures) to be handled independently from data-fetching or repository-related issues, ensuring more accurate error reporting and easier debugging.

##### `container = document.querySelector('.carousel');`

- **Purpose:** Directly assigns the `.carousel` DOM node to `container`, without fallback.
- **Benefit:** Ensures that image-related errors are rendered exactly where image previews appear, making them immediately visible to the user. If `.carousel`is missing, a later `if (!container) return;` check prevents runtime errors.

##### `break;`

- **Purpose:** Ends the execution of the `'Image'` case within the `switch`.
- **Benefit:** Avoids fall-through into the `default` case and ensures that the container selected image errors remains unchanged.

##### `default:`

- **Purpose:** Handles any error whose `context` value does not match a predefined case.
- **Benefit:** Provides a safety net for unexpected or undefined contexts, ensuring that all errors are processed and none are silently ignored.

##### `container = this.userProfile;`

- **Purpose:** Assigns the user profile DOM node as the default container for error messages.
- **Benefit:** Guarantees that even unclassified errors are shown in a visible and stable UI location, preventing silent failures and maintaining user awareness.

##### `if (!container) return;`

- **Purpose:** Ensures that the `container` element exists before attempting to modify its content. This guard clause checks whether `container` is truthy (i.e., not `null` or `undefined`). If it's missing, the function exists to avoid executing invalid DOM operations.
- **Benefit:** Prevents runtime exceptions such as `TypeError`, which would crash the application if the code tried to access properties of a non-existent DOM element. This keeps the UI stable and avoids breaking the user experience.<br><br>

```js
container.innerHTML = `<p>${error.message}</p>`;
```

- **Purpose:** Injects the error message into the selected container by replacing its content with a `<p>` element. The use of template literals allows dynamic rendering of the error text, making the message context-aware and readable.
- **Benefit:** Provides clear and immediate feedback to the user about what went wrong, improving transparency and aiding in debugging. It ensures that errors are not silently ignored and are instead communicated visually.

##### `this.userProfile.classList.remove('hidden');`

- **Purpose:** Ensures that the user profile section is visible after rendering the error message. By removing the `'hidden'` class, the code guarantees that the container holding the error is displayed on screen.
- **Benefit:** Guarantees visibility of the error message, even if the profile section was previously hidden due to a failed request or empty state. This improves usability by making sure the user sees the feedback.

##### `export { screen };`

- **Purpose:** Exports the UI controller for use in other modules.
- **Benefit:** Enables the entry script and others to trigger UI updates cleanly.<br><br>

### `carousel.js`

#### 🎠 Dynamic Repository Preview Module

```js
import {currentUsername } from '../global.js';

function updateRepoView(repo) {
    const carousel = document.querySelector('.carousel');

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
             <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`;
    };
};

export { updateRepoView };
```

##### `import { currentUsername } from '../global.js';`

- **Purpose:** Imports the live `currentUsername` value across shared modules.
- **Benefit:** Ensures the preview URL reflects the most recently searched GitHub user without manual prop-passing.

##### `function updateRepoView(repo) {`

- **Purpose:** Declares a function that updates the carousel view with a visual preview and link for the given repository.
- **Benefit:** Encapsulates the logic for rendering repository previews, making the code modular and reusable.

##### `const carousel = document.querySelector('.carousel');`

- **Purpose:** Selects the DOM element with the class `.carousel`, which is the container for displaying repository previews.
- **Benefit:** Targets the correct section of the UI for rendering the preview, ensuring visual consistency.

##### `if (!carousel || !repo) return;`

- **Purpose:** Checks whether the `carousel` element exists and whether a valid `repo` object was passed. If either is missing, the function exits early.
- **Benefi:** Prevents runtime errors and unnecessary execution when required data or DOM elements are unavailable.<br><br>

```js
let repoUrl = `https://${currentUsername}.github.io/${repo.name}`;
```

- **Purpose:** Constructs the GitHub Pages URL for the repository using the current username and repository name.
- **Benefit:** Dynamically generates the correct preview URL for each repository, enabling accurate screenshot rendering.<br><br>

```js
let previewImg = `https://api.microlink.io/?url=${encodeURIComponent(repoUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
```

- **Purpose:** Builds the URL for the Microlink API, which returns a screenshot image of `repoUrl`.
- **Benefit:** Integrates third-party preview functionality, enhancing the user experience with visual feedback.

##### `carousel.innerHTML = '<div class="image-loader"><div class="loader"></div></div>';`

- **Purpose:** Temporarily displays a loading animation while the preview image is being fetched.
- **Benefit:** Improves user experience by providing visual feedback during asynchronous image loading.

##### `let img = new Image();`

- **Purpose:** Instantiates a new `Image` object using the built-in JavaScript constructor. Unlike creating an `<img>` element via `document.createElement('img')`, this approach immediately creates an image in memory and begins loading once the `src` is assigned. This object is not yet attached to the DOM, allowing the developer to configure its behavior — such as setting classes or defining event handlers — before rendering it on the page.
- **Benefit:** Provides full control over the image loading lifecycle. By using the `onload` and `onerror` event handlers, the application can respond to success or failure before the image is displayed. This enables smoother user experience, such as showing a loader during fetch, replacing it with the image on success, or displaying a fallback messaage if the image fails to load.

##### `img.src = previewImg;`

- **Purpose:** Sets the source of the image to the URL generated via Microlink.
- **Benefit:** Initiates the image loading process for the repository preview.

##### `img.classList.add('preview-page');`

- **Purpose:** Adds a CSS class to the image for styling purposes.
- **Benefit:** Ensures consistent styling of preview images across the UI.

##### 🔁 Image Load Handler
```js
img.onload = () => {
    carousel.innerHTML =
        `<img class="preview-page" src="${previewImg}" alt="Preview of ${repo.name}"/>
         <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`;
};
```

- **Purpose:** Defines a callback that runs when the image loads successfully. It replaces the loader with the actual image and a link to the repository.
- **Benefit:** Provides a smooth transition from loading state to preview, enhancing usability and visual feedback.

##### ❌ Image Error Handler
```js
img.onerror = () => {
    carousel.innerHTML =
        `<p role="alert">⚠️ We couldn't load the image. Please try again later.</p>
         <h3><a href="${repo.html_url}" target="_blank" id="repo-link">${repo.name}</a></h3>`;
};
```

- **Purpose:** Defines a callback that runs if the image fails to load. It displays an error message and still shows the repository link.
- **Benefit:** Ensures graceful degradation — even if the preview fails, the user can still access the repository.

##### `export { updateRepoView };`

- **Purpose:** Makes the `updateRepoView` function available to other modules.
- **Benefit:** Promotes modular architecture and code reuse across the application.<br><br>

---
