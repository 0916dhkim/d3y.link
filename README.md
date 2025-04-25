# d3y.link

## 1. Overview

### 1.1 Description

`d3y.link` is a full-stack URL shortening service that lets users create short links and track click statistics.  
Admins can log in to a dashboard to create, update, or delete links. Each link logs the number of clicks and last click time.

### 1.2 Key Techs

1. **BackEnd**: Express.js with Typescript, PostgreSQL, Cookie-based session
2. **FrontEnd**: React, TypeScript, CSS Modules,
3. **Others**: Node.js, pg, bcrytjs, dotenv

## 2. Setup

### 2.1 BackEnd

```bash
# 1. Go to BackEnd folder
cd BackEnd

# 2. Install all dependencies
npm install

# 3. Setup env
cp .env.example .env

# 4. run server
npm run dev
```

### 2.2 FrontEnd

```bash
# 1. Go to FrontEnd folder
cd FrontEnd

# 2. Install all dependencies
npm install

# 3. Setup env
cp .env.example .env

# 4. run server
npm start
```

## 3. Usage

This project contains **both FrontEnd and BackEnd** code.

### 3.1 Frontend URLs

-   `/`  
    Public homepage that displays all shortened links in descending order of creation

-   `/dashboard`  
    Admin-only dashboard (requires login). Features include:
    -   Viewing a table of all links
    -   Creating new short links (opens modal)
    -   Editing and deleting links (modal UI)
    -   Copy link button / Visit link button
    -   Auto logout timer (7-day expiration) with refresh option

### 3.2 Backend API Endpoints

#### `GET /`

-   **Description**: Fetch all shortened links
-   **Response**:

```json
[
  {
    "slug": "testslug",
    "url": "https://example.com",
    "create_date": "2025-02-05T22:05:14.897Z",
    "update_date": "2025-02-06T19:21:42.889Z",
    "clicks": 6,
    "last_click": "2025-04-25T12:35:27.484Z"
  }
  ...
]
```

#### `POST /`

-   **Description**: Create a new short link
-   **Request Body**:

```json
{
    "slug": "abc123",
    "url": "https://example.com"
}
```

-   **Response**:

```json
{
    "slug": "test4",
    "url": "https://test4.com",
    "create_date": "2025-04-25T13:17:34.527Z",
    "update_date": "2025-04-25T13:17:34.527Z",
    "clicks": 0,
    "last_click": null
}
```

#### `GET /:slug`

-   **Description**: Redirects to the original URL and increases click count. Also update last_click time.

#### `PUT /:slug`

-   **Description**: Update the original URL and slug for a given slug
-   **Request Body**:

```json
{
    "slug": "test5",
    "url": "https://test5.com"
}
```

-   **Response**:

```json
{
    "message": "Link updated successfully",
    "link": {
        "slug": "test5",
        "url": "https://test5.com",
        "create_date": "2025-04-25T13:17:34.527Z",
        "update_date": "2025-04-25T13:23:55.802Z",
        "clicks": 1,
        "last_click": "2025-04-25T13:18:56.229Z"
    }
}
```

### `DELETE /:slug`

-   **Description**: Delete the short link by slug
-   **Response**:

```json
{
    "message": "Link deleted successfully"
}
```

## 5. Authentication & Sessions

-   Admin logs in via email and password.

-   On login:

    -   A session_token is created and stored in the DB
    -   The token is returned to the client in a secure cookie (HttpOnly, SameSite=Strict).

-   Sessions are valid for 7 days since last access.
-   Session can be checked (GET /session) and destroyed (POST /logout).

## 6. Database Schema

## `users`

| Column       | Type      | Description                 |
| ------------ | --------- | --------------------------- |
| `id`         | SERIAL    | Primary Key                 |
| `email`      | TEXT      | Unique login email          |
| `password`   | TEXT      | Hashed with bcrypt          |
| `last_login` | TIMESTAMP | Timestamp of the last login |

---

## `sessions`

| Column          | Type      | Description                |
| --------------- | --------- | -------------------------- |
| `id`            | SERIAL    | Primary Key                |
| `user_id`       | INTEGER   | Foreign Key → `users.id`   |
| `session_token` | TEXT      | Randomly generated token   |
| `created_at`    | TIMESTAMP | Session creation timestamp |

---

## `links`

| Column        | Type      | Description                   |
| ------------- | --------- | ----------------------------- |
| `slug`        | TEXT      | Unique short key (identifier) |
| `url`         | TEXT      | Original full URL             |
| `create_date` | TIMESTAMP | Creation date of the link     |
| `update_date` | TIMESTAMP | Last updated timestamp        |
| `clicks`      | INTEGER   | Total number of clicks        |
| `last_click`  | TIMESTAMP | Timestamp of the last click   |

## 7. Auto Logout Behavior

-   A timer shows remaining time until auto logout.
-   Sessions expire after **7 days**.
-   Users can refresh the session manually via UI.
-   Once expired, users are logged out and redirected to the login page.

---

## 8. UI Components

### Pages

-   `Login.tsx`: Admin login page
-   `Dashboard.tsx`: Authenticated dashboard for admin
-   `PublicHome.tsx`: Public link list view

### Components

-   `CreateLinkModal.tsx`: Modal for adding a new link
-   `DeleteConfirmModal.tsx`: Confirmation modal shown before deleting a link
-   `EditLinkModal.tsx`: Modal for updating an existing link
-   `LinkList.tsx`: Table displaying all links in the admin dashboard
-   `ProtectedRoute.tsx`: Wrapper to restrict routes to authenticated users only
-   `PublicLinkList.tsx`: Displays public-facing list of links on the homepage
