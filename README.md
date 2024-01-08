# Anchornaut - Full Stack Web Application

Anchornaut is a full-stack project that empowers you to turn your wildest dreams into achievable and concrete personal projects. The platform leverages the OpenAI GPT (Generative Pre-trained Transformer) chat API to create a dynamic system where users can input their dreams, and the AI generates tasks and subtasks to help bring those dreams to life. The project includes both a backend and a front-end component.

Here's a breakdown of the key technologies and components powering the project:

## Frontend - Project Management Server
- you can access the client repository <a href="https://github.com/Marcela-Rocha-Martins/AnchorNaut-client/" style="text-decoration: none; color: transparent;">HERE</a>

## Backend - Project Management Server

### Database Management

The backend leverages MongoDB as the database management system. MongoDB is a NoSQL, document-oriented database that provides flexibility and scalability. It is accessed and managed using the MongoDB object modeling tool, Mongoose, which facilitates interactions with the database through JavaScript.

### Server-Side Language

The server is implemented using Node.js, a JavaScript runtime built on the V8 JavaScript engine. Express.js, a minimal and flexible Node.js web application framework, is employed to streamline the development of robust and scalable server-side applications. The server-side logic is written in JavaScript, offering a seamless transition between client and server code.

### Authentication and Security

To ensure secure and authenticated communication, the backend utilizes technologies such as JSON Web Tokens (jsonwebtoken) and bcrypt for password hashing. Express-jwt is employed as middleware for handling JSON Web Tokens in Express.js.

### External APIs

Anchornaut integrates with external APIs, including OpenAI, to harness the power of natural language processing. The OpenAI API enables the generation of tasks and subtasks based on user input, transforming dreams into actionable project plans.

### Deployment
- You can access the live website [HERE](https://anchornaut.netlify.app)

