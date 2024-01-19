# Vite Firebase Auth template

made by [ZacKenichi](https://github.com/zackenichi)

## Tech stack

- Vite
- React
- Typescript
- React Router Dom
- React Context

## 1. Create new firebase project

1. Go to the [firebase console](https://console.firebase.google.com/) and click on add project

2. Add a project name for example, `vite-typescript-auth` and click continue

3. Do not enable analytics for now and click on create project.

4. And then just wait for a couple of minutes while the project is getting provisioned and then click on continue.

## 2. Register the app

1. The Project Overview page is opened after the previous step, we will need to create a new firebase app from here.

2. You will see icons under the get started page, go on and click on web

3. Add an app name, in this case, we will use `vite-typscript-auth`

4. Make sure that the checkbox for setting up firebase hosting is unchecked

5. Click on register app

6. You can save the firebase credentials but we can always get back to it later

7. You can click on `Go to console`

## 3. Provision the authentication service

1. Select on the build tab and then click on authentication

2. Click on Get Started and then go to Sign-in method

3. Click on the providers you want to use, in this case, we will use email.

4. Click on enable and then hit save

5. We can add more providers by clicking `Add new provider`

## 3. Setup a new Vite project

1. Open a terminal and then create a new vite project using the following commands:

```bash
  npm create vite@latest vite-firebase-auth -- --template react-ts
  cd vite-firebase-auth
  npm install
  npm run dev
```

yarn

```bash
yarn create vite react-vite-template --template react-ts
```

2. After checking that everything works fine, you can stop the server by pressing ctrl/cmd + C

## 4. Install dependencies

```bash
  npm install react-router-dom firebase
```

## 5. Setup firebase connection

1. Create `firebase` folder under src and create a file named `BaseConfig.ts` and add the following code:

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

export const firebaseAuth = getAuth(app);
export default app;
```

2. In the firebase folder, create the `AuthService.ts` file

```tsx
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { firebaseAuth } from './BaseConfig';

//required if you want to keep logged in after user exits the browser or closes tab
setPersistence(firebaseAuth, browserLocalPersistence);

//Sign in functionality
export const SignIn = async ({ email, password }: LoginFormValues) => {
  const result = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  return result;
};

//Sign up functionality
export const SignUp = async ({ email, password }: UserFormValues) => {
  const result = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  return result;
};

//Sign out functionality
export const SignOut = async () => {
  await signOut(firebaseAuth);
};
```

3. Create the `interfaces` under src

interfaces.ts

```ts
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName: string;
}
```

4. Create the `.env.local` file under root and add your firebase credentials

```ts
VITE_FIREBASE_KEY = '';
VITE_FIREBASE_DOMAIN = '';
VITE_FIREBASE_DATABASE = '';
VITE_FIREBASE_PROJECT_ID = '';
VITE_FIREBASE_STORAGE_BUCKET = '';
VITE_FIREBASE_SENDER_ID = '';
VITE_FIREBASE_APP_ID = '';
VITE_FIREBASE_MEASUREMENT_ID = '';
```

## 6. Set up auth context

1. Create a context folder and a file named `AuthContext.ts` under the src folder

```tsx
import { firebaseAuth } from '../firebase/BaseConfig';
import { createContext } from 'react';

export const AuthContext = createContext<IAuth>({
  user: firebaseAuth.currentUser,
  loading: false,
  SignIn: () => {},
  SignUp: () => {},
  SignOut: () => {},
});
```

2. Create Interface `IAuth` that's getting used by the Auth Context. You can add the following to the interfaces file.

```tsx
import { User } from 'firebase/auth';

export interface IAuth {
  user: User | null;
  loading: boolean;
  SignIn: (creds: LoginFormValues) => void;
  SignUp: (creds: UserFormValues) => void;
  SignOut: () => void;
}
```

\*\* don't forget to import it in AuthContext

3. Create a
