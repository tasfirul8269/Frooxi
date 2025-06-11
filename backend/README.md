# Backend Server for Frooxi Web Glow

This directory contains the backend server for the Frooxi Web Glow application, built with Node.js, Express, and MongoDB. It provides APIs for managing portfolios, subscription models, team members, and user authentication.

## Features

- **User Authentication**: Register, login, and manage user accounts with JWT-based authentication.
- **Portfolio Management**: Create, read, update, and delete portfolio items with image uploads to Cloudinary.
- **Subscription Management**: Create, read, update, and delete subscription plans.
- **Team Member Management**: Create, read, update, and delete team member profiles with image uploads to Cloudinary.
- **MongoDB Integration**: Uses Mongoose for MongoDB Atlas database interactions.
- **Cloudinary Integration**: Handles image uploads and storage.

## Setup and Installation

Follow these steps to set up and run the backend server:

1.  **Navigate to the Backend Directory**:

    ```bash
    cd backend
    ```

2.  **Install Dependencies**:

    Install the required Node.js packages using npm or yarn:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:

    Create a `.env` file in the root directory of the project (e.g., `e:\Frooxi\frooxi-web-glow\.env`) and add the following environment variables:

    ```
    MONGO_URI=<Your MongoDB Atlas Connection String>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    JWT_SECRET=<A strong, random secret key for JWT>
    ```

    -   **MONGO_URI**: Your connection string for MongoDB Atlas. You can get this from your MongoDB Atlas dashboard.
    -   **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**: Your Cloudinary account credentials. You can find these on your Cloudinary dashboard.
    -   **JWT_SECRET**: A secret key used to sign and verify JWT tokens. Generate a strong, random string for this.

4.  **Create Uploads Directory**:

    Ensure that an `uploads` directory exists within the `backend` directory. This is used by Multer for temporary file storage before uploading to Cloudinary.

    ```bash
    mkdir uploads
    ```

5.  **Run the Server**:

    Start the Express server:

    ```bash
    node server.js
    ```

    The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### User Authentication

-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/login`: Authenticate a user and get a JWT token.
-   `GET /api/users/me`: Get current user's data (requires authentication).

### Portfolio Management

-   `POST /api/portfolio`: Create a new portfolio item (Admin only, requires image upload).
-   `GET /api/portfolio`: Get all portfolio items.
-   `GET /api/portfolio/:id`: Get a single portfolio item by ID.
-   `PUT /api/portfolio/:id`: Update a portfolio item (Admin only, requires image upload).
-   `DELETE /api/portfolio/:id`: Delete a portfolio item (Admin only).

### Subscription Management

-   `POST /api/subscriptions`: Create a new subscription plan (Admin only).
-   `GET /api/subscriptions`: Get all subscription plans.
-   `GET /api/subscriptions/:id`: Get a single subscription plan by ID.
-   `PUT /api/subscriptions/:id`: Update a subscription plan (Admin only).
-   `DELETE /api/subscriptions/:id`: Delete a subscription plan (Admin only).

### Team Member Management

-   `POST /api/team`: Create a new team member (Admin only, requires image upload).
-   `GET /api/team`: Get all team members.
-   `GET /api/team/:id`: Get a single team member by ID.
-   `PUT /api/team/:id`: Update a team member (Admin only, requires image upload).
-   `DELETE /api/team/:id`: Delete a team member (Admin only).

## Technologies Used

-   Node.js
-   Express.js
-   Mongoose (for MongoDB)
-   bcryptjs (for password hashing)
-   jsonwebtoken (for JWT authentication)
-   Multer (for handling `multipart/form-data`)
-   Cloudinary (for image storage)
-   CORS (for cross-origin resource sharing)
-   dotenv (for environment variables)