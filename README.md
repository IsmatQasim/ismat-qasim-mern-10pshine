# Notify - A Note-Taking App ✍️
<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/b75c0c09-4e3f-4314-ad0e-20872a8ce906" />
<img width="1915" height="969" alt="image" src="https://github.com/user-attachments/assets/82cd135e-1d57-40b0-8b32-3927eb8ba5b2" />
<img width="1920" height="970" alt="image" src="https://github.com/user-attachments/assets/28d58eaf-55fc-4102-90b8-94e9c6fed324" />


## Overview

**Notify** is a note-taking application that allows users to create, view, update, delete, and manage notes. Users can mark notes as favorites, view today's notes, and save drafts. Additionally, users can log in, log out, reset their password, and change their password. 🔐📓

---

## Table of Contents

* [Frontend (Testing Included)](#frontend-testing-included)
* [Backend (Testing)](#backend-testing)
* [Installation](#installation)
* [SonarQube Integration](#sonarqube-integration)

---

## Frontend 🖥️

### Features:

* **Create Notes**: Users can create new notes with titles and descriptions. ✏️
* **See Notes**: View all created notes, including favorites and drafts. 👀
* **Update Notes**: Users can edit existing notes. ✍️
* **Delete Notes**: Users can delete notes that are no longer needed. ❌
* **Favorite Notes**: Users can mark notes as favorites for easy access. 💖
* **Today's Notes**: View notes created today. 📅
* **Drafts**: Users can save notes as drafts before finalizing them. 📝
* **Login/Logout**: Users can securely log in and out of the application. 🔑🚪
* **Password Reset/Change**: Users can reset or change their passwords. 🔒🔄

### Testing:

The frontend is tested using **Vitest** for testing React components and logic. It also includes **React Testing Library** for rendering components and simulating user interaction. ✅

![image](https://github.com/user-attachments/assets/73720a92-2743-4089-8b0a-0a2c45c5ff0e)

---

## Backend 🔙

### Features:

* **User Authentication**: Implementing secure user login, logout, and password management functionalities. 🔑🔐
* **Note Management**: Handling create, read, update, delete (CRUD) operations for user notes. 📑🔄
* **Favorites & Drafts**: Managing notes marked as favorites or saved as drafts. 💫📝
* **Today's Notes**: Filtering and displaying notes created today. 📅✨
* **Database Integration**: Using **MongoDB** for storing user data and notes. 💾

### Testing:

The backend is tested using **Mocha** and **Chai** for unit testing and assertions. **Supertest** is used for API testing to ensure the server-side functionality works as expected. ✅

![image](https://github.com/user-attachments/assets/0c0dc73b-2b3b-46b0-a2ca-71bf4cf10dfd)

---

## SonarQube Integration 🔍

SonarQube is integrated into this project for **static code analysis** and to ensure **code quality**. It helps in identifying code smells, bugs, vulnerabilities, and provides detailed insights into the quality of the codebase.

![image](https://github.com/user-attachments/assets/60c32b16-a508-4ccd-9145-70c7b2667daa)

---
