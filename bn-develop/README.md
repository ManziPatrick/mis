# MIS

## Features
- **Authentication**:
  - Login functionality for users.
  - Secure token generation.
- **User Management**:
  - Create, read, update, and delete (CRUD) operations for users.
  - Role management with customizable access rights.
- **Scalability**:
  - Built to handle multiple users and roles.
- **Real-Time Analytics** (future enhancements):
  - Monitor system usage.

## API Endpoints
### Authentication
#### POST `/auth/login`
- **Description**: Allows users to log in and retrieve a token.
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```
- **Response**:
  - **200 OK**: Returns a token and user details.
  - **401 Unauthorized**: Invalid credentials.

### User Management
#### GET `/user`
- **Description**: Fetches all registered users.
- **Response**:
  - **200 OK**: Array of user objects.
  - **401 Unauthorized**: Missing or invalid token.

#### POST `/user`
- **Description**: Creates a new user.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- **Response**:
  - **201 Created**: Returns the created user object.
  - **400 Bad Request**: Invalid input.

#### GET `/user/{id}`
- **Description**: Fetches user details by ID.
- **Response**:
  - **200 OK**: User object.
  - **404 Not Found**: User not found.

#### PUT `/user/{id}`
- **Description**: Updates a user's details.
- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```
- **Response**:
  - **200 OK**: Updated user object.
  - **404 Not Found**: User not found.

#### DELETE `/user/{id}`
- **Description**: Deletes a user by ID.
- **Response**:
  - **200 OK**: User successfully deleted.
  - **404 Not Found**: User not found.

## Technologies Used
- **Backend**: Node.js with Express.js
- **Database**: MongoDB for data storage
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication
- **API Documentation**: OpenAPI 3.0 (Swagger)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/GenesisTechnologies2024/MIS-bn.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mis-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your `.env` file with the following variables:
   ```env
   PORT=5000
   DATABASE_URI=mongodb://localhost:27017/sessionDB
   JWT_SECRET=your-secret-key
   ```

## Usage
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Access the API at:
   - Local: `http://localhost:5000/api`
   - Production: https://mis-genesistechnologies2024-bn.onrender.com 
3. View API documentation:
   - Use Swagger UI or a similar tool to explore the API endpoints.

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push changes:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the ISC License. See the LICENSE file for details.

## Contact
For any inquiries or support, email [munyeshurimanzi@gmail.com](mailto:munyeshurimanzi@gmail.com).

