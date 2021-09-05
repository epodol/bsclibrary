# Contributing

We would love for you to contribute to `bsclibrary`, pull requests are welcome! Please contact `support@bsclibrary.net` if you would like to become a contributor.

## Setting up your workspace

1. Ensure you have the following installed:

   - Node.JS v14
   - Node Package Manager v7
   - Firebase CLI

1. Clone the repo

   ```
   > git clone https://github.com/epodol/bsclibrary.git
   > cd bsclibrary
   ```

   or

   [![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/epodol/bsclibrary)

1. Install dependencies
   ```
   > npm install --no-audit
   ```
1. Start the React development server, Typescript compiler, and Firebase Emulators.
   ```
   > npm run start
   ```
1. Open [http://localhost:3000](http://localhost:3000) (React development server) and [http://localhost:4000](http://localhost:4000) (Emulator UI) in your browser. It will automatically reload if you change any of the source files.

## Emulator Data Export

This project includes Firebase Emulator Data that is used for testing. This data is not available in a production environment, and is only used for testing. You can view this data in the [Emulator UI](http://localhost:4000).

To get started quickly, you can log in using either of the following credentials:

- Email: `admin@bsclibrary.net` Password: `bsclibrary`
- Email: `student@bsclibrary.net` Password: `bsclibrary`
