# Coursera Backend

This repository contains the backend for the Coursera app, which provides an API for managing courses and user enrollments. The backend is built using Node.js and Express, with two main user roles: **Admins** and **Users**.

## Features

### Admin Features
- Admins can **create, update, and delete courses**.
- Admins can **view all courses**.
- Authentication and authorization for admin actions.

### User Features
- Users can **view available courses**.
- Users can **purchase/enroll in courses**.
- Users can **get a list of purchased courses**.
- Authentication and authorization for user actions.

## API Endpoints

### Admin Routes
- `POST /admin/signup` - Create a new admin account.
- `POST /admin/login` - Login as an admin.
- `POST /admin/courses` - Create a new course (Authenticated Admins only).
- `PUT /admin/courses/:courseId` - Update a course (Authenticated Admins only).
- `DELETE /admin/courses/:courseId` - Delete a course (Authenticated Admins only).
- `GET /admin/courses` - Get a list of all courses.

### User Routes
- `POST /users/signup` - Create a new user account.
- `POST /users/login` - Login as a user.
- `GET /users/courses` - Get a list of available courses.
- `POST /users/courses/:courseId` - Purchase a course.
- `GET /users/purchasedCourses` - Get a list of purchased courses.

## Technologies Used
- Node.js
- Express.js
- JSON Web Tokens (JWT) for authentication
- Middleware for authentication and authorization
- Simple in-memory storage (can be extended to use a database like MongoDB or PostgreSQL)

## How to Run
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Use Postman or any API testing tool to interact with the endpoints.

## Future Enhancements
- Implement a database (MongoDB/PostgreSQL) for persistent storage.
- Add validation and error handling.
- Improve security with password hashing and stricter authentication.
- Build a frontend to interact with the backend.

## License
This project is open-source and available for modification and distribution.
