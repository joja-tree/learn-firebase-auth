const config = {
  apiKey: 'AIzaSyBK5bgkLQ_kigELtNaar1hcIhpqPwPVZX4',
  authDomain: 'learn-firebase-auth-330d3.firebaseapp.com',
  projectId: 'learn-firebase-auth-330d3',
  storageBucket: 'learn-firebase-auth-330d3.appspot.com',
  messagingSenderId: '317926167757',
  appId: '1:317926167757:web:f7e96ec02973c913ca0584',
  // measurementId: "G-*******"
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
