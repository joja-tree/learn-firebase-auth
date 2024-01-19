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

npm

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

1. Create `firebase` folder under src and create a file named `firebase-config.ts` and add the following code:

```ts
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.' +
        '\n' +
        "Add your web app's configuration object to firebase-config.ts"
    );
  } else {
    return config;
  }
}
```

2. In the firebase folder, create the `firebase.ts` file

```tsx
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User,
} from 'firebase/auth';
import { getFirebaseConfig } from './firebase-config';

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (email: string, password: string) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const SignOutUser = async () => await signOut(auth);
```

3. Create the `.env.local` file under root and add your firebase credentials

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

Create a context folder and a file named `AuthContext.ts` under the src folder

```ts
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SignOutUser, userStateListener } from '../firebase/firebase';
import { createContext, useState, useEffect, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentUser: (_user: User) => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = () => {
    SignOutUser();
    setCurrentUser(null);
    navigate('/');
  };

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

## 7. Setup routing

Create a `routes` folder and creater the `home` and `profile` page

home.tsx

```tsx
import { ChangeEvent, FormEvent, useState } from 'react';
import reactLogo from '.././assets/react.svg';
import { signInUser } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import '.././App.css';

const defaultFormFields = {
  email: '',
  password: '',
};

function Home() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        resetFormFields();
        navigate('/profile');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('User Sign In Failed', error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="App">
      <div className="card">
        <div className="logo-react">
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <input id="recaptcha" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
```

profile.tsx

```tsx
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

function Profile() {
  const { currentUser, signOut } = useContext(AuthContext);

  return (
    /**
     * Extract the currrentUser from the context, if you want to
     * get the User info, like the email, display name, etc.
     */
    <div>
      <h3>Welcome! {currentUser?.email}</h3>
      <p>Sign In Status: {currentUser && 'active'}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
export default Profile;
```

components/require-auth.tsx

```tsx
import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) {
    // Redirect the user to the home page.
    // Please! Close the mustache {{}}
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
```

## 8. Update `App.tsx`

```tsx
import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/auth-context';
import RequireAuth from './components/require-auth';
import Home from './routes/home';
import Profile from './routes/profile';

function App() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // NOTE: console log for testing purposes
  console.log('User:', !!currentUser);

  // Check if currentUser exists on initial render
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route
        path="dashboard"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
```

## 9. Wrap the main component, you should look for `main.tsx` in root

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```
