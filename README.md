# Frooxi Web Glow

This project consists of a React frontend and a Node.js/Express backend, designed to showcase dynamic content management for portfolios, subscription models, and team members.

## Project Structure

-   `src/`: Contains the React frontend application.
-   `backend/`: Contains the Node.js/Express backend server.

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Backend Setup

Navigate to the `backend` directory and follow its specific setup instructions.

```bash
cd backend
# Follow instructions in backend/README.md
```

### 2. Frontend Setup

After setting up the backend, return to the project root directory and install frontend dependencies.

```bash
cd .. # If you are in the backend directory
npm install
# or
yarn install
```

### 3. Running the Project

#### Running the Backend

From the `backend` directory:

```bash
node server.js
```

#### Running the Frontend

From the project root directory:

```bash
npm run dev
# or
yarn dev
```

This will start the development server for the frontend, usually accessible at `http://localhost:5173`.

## Technologies Used

### Frontend

-   React
-   Vite
-   Shadcn UI
-   Tailwind CSS
-   GSAP
-   Framer Motion

### Backend

-   Node.js
-   Express.js
-   MongoDB Atlas (via Mongoose)
-   Cloudinary (for image storage)
-   JWT (for authentication)
-   bcryptjs (for password hashing)
-   Multer (for file uploads)

## API Endpoints

Refer to the `backend/README.md` file for a detailed list of API endpoints.
