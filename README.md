A simple blog application where users can create, view, and manage blog posts. This project demonstrates CRUD (Create, Read, Update, Delete) functionality, 
using Express.js for routing and MongoDB for data storage. It also includes error handling and dynamic rendering of posts using EJS templates.

**Features**
- View a list of all blog posts.
- Create new blog posts with a title and content.
- Edit and delete existing blog posts.
- Error handling with user-friendly error pages.

📝Setup Instructions
- Clone this repository
- Install dependencies:
- Set up your MongoDB connection:
In database.js, replace <your-mongo-db-uri> with your MongoDB connection URI.
``const MongoClient = require('mongodb').MongoClient;
const uri = "<your-mongo-db-uri>";``

- Start the application, npm start
- Open your browser and go to http://localhost:3000.

_ Homepage: Lists all blog posts.
_ Create Post: Click the "New Post" button to add a blog post.
_ Edit Post: Click the "Edit" button next to a post to modify it.
_ Delete Post: Click the "Delete" button to remove a post.

Error Handling: If something goes wrong (e.g., invalid URL), a custom error page is displayed.
Technologies Used: 
Node.js, Express.js, MongoDB, EJS for templating

🧐Future Enhancements
- Add user authentication for secure access to posts.
- Implement a rich text editor for blog post content.
- Add categories and tags for better organization.
