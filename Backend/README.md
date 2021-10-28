# Node server for authentication and CRUD operation

This is a basic node server for authenticating user using PassportJS.

It uses MongoDB based remote DB instance at MongoDB Atlas for managing user details.

The server uses in-memory (non-persistent - session are flushed on server shutdown)
session based authentication using cookies.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server for serving at [http://localhost:5001](http://localhost:5001)
Any error occurred will be logged into console

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.