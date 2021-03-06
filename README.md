# BASIS Scottsdale Library Website

## Setting up your workspace

1. Clone the repo
   ```
   > git clone https://github.com/epodol/bsclibrary.git
   > cd bsclibrary
   ```
1. Install dependencies
   ```
   > npm install
   ```
1. Install **Firebase Tools** globally
   ```
   > npm install -g firebase-tools
   ```
1. Login to firebase using this tool in CLI
   ```
   > firebase login
   ```
1. Create a Firebase Project in `http://console.firebase.google.com`.
1. Copy your Firebase Project's id into `.firebaserc`
1. Copy your Firebase config from your Firebase dashboard's Web Setup and paste to a new file named `.env`.
1. Start the React development server and emulators.
   ```
   > npm run start
   > npm run dev
   ```
