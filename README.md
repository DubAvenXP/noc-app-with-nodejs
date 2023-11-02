# NOC App

This is a NOC (Network Operations Center) app built with Node.js and TypeScript using clean architecture.
It allows you to save logs using FileSystem, MongoDB, and PostgreSQL.

To get started, make sure you have Node.js installed on your machine. Then, clone the repository
and run `npm install` to install the dependencies. You can then run the app using `npm run dev` for use the app
as developer or `npm run start` for use the app as production.

The app is structured using clean architecture principles, with separate layers for domain logic, use cases,
and infrastructure. This makes it easy to maintain and test the codebase.

To save logs, you can choose between three different storage options: FileSystem, MongoDB, and PostgreSQL.
Each storage option has its own implementation, which can be found in the `src/infrastructure` directory.

Using the repository pattern, the app can easily be extended to support other storage options.

For more information on how to use the app, please refer to the README file in the root directory of the project.
