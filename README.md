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

- In `screen.renderRepo(...)`, subsequent DOM updates (repo counter, carousel, buttons) occur in the same live region and are announced politely when appropriate.

