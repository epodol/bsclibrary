# BASIS Scottsdale Library Website

## Setting up your workspace
1. Create a Firebase Project in `http://console.firebase.google.com`.
1. Clone the repo
    ```
    > git clone 
    > cd bsclibrary
    > npm install
    ```
1. Install dependencies
1. Install **Firebase Tools** globally
    ```
    > npm install -g firebase-tools
    ```
1. Login to firebase using this tool in CLI
    ```
    > firebase login
    ```
1. CD into the repo and initialize firebase.
    ```
    > cd bsclibrary
    > firebase init
    ```
1. Configure firebase:
    1. Allow CLI features for **Firestore**, **Functions**, **Hosting**, **Storage**, and **Emulators**.
    1. Select your Firebase project to be used.
    1. Accept default rules file for Firestore `firestore.rules`.
    1. Accept default rules file for Firestore `firestore.indexes.json`.
    1. Select `JavaScript` for your Cloud Functions language.
    1. Enable ESLint *(optional)*.
    1. Install dependencies.
    1. Accept the default public directory for Hosting `public`.
    1. Do **not** configure as a single-page app.
    1. Do **not** setup automatic builds and deploys with GitHub.
    1. Accept default rules file for Storage `storage.rules`.
    1. Setup emulators for **Authentication**, **Functions**, **Firestore**, and **Hosting** and use the default ports.
    1. Enable the Emulator UI, use any availale port, and download the emulators now.
    1. *Firebase initialization complete!*
    
1. Copy your Firebase config from your dashboard's  Web Setup and paste to a new file named `.env.local`.
1. Start the react development server and emulators.
```
> npm start
```

## License <img src="https://creativecommons.org/images/deed/cc_icon_white_x2.png" alt="Creative Commons" width="25"/> <img src="https://creativecommons.org/images/deed/attribution_icon_white_x2.png" alt="Attribution" width="25"/> <img src="https://creativecommons.org/images/deed/nc_white_x2.png" alt="NonCommercial" width="25"/>



The BASIS Scottsdale Library website is licenced under [the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) licence](https://creativecommons.org/licenses/by-nc/4.0//).  Please ensure you are familiar with the license before contributing to this project. A couple of key takeaways:

- If you choose to share or alter this project, you **MUST** give credit to the contributors of this project.
- You may **NOT** use any of this project for commercial purposes.

