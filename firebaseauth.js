// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js"
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBby_IF_uDrXS8IKrERZ4T_27gaMyBstSQ",
    authDomain: "login-form-be4da.firebaseapp.com",
    projectId: "login-form-be4da",
    storageBucket: "login-form-be4da.firebasestorage.app",
    messagingSenderId: "111575470518",
    appId: "1:111575470518:web:998c71ba668b1534567117"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },3000);
  }
  const signUp=document.getElementById('submitSignUp');
  signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;
  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        email,
        firstName,
        lastName
      };

      const docRef = doc(db, "users", user.uid);

      return setDoc(docRef, userData);
    })
    .then(() => {
      showMessage('Account Created Successfully', 'signUpMessage');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create user', 'signUpMessage');
      }
    });
});

  const signIn=document.getElementById('submitSignIn');
  signIn.addEventListener('click', (event) => {
  event.preventDefault();

  const recaptchaResponse = grecaptcha.getResponse();

if (!recaptchaResponse) {
  showMessage('Please complete reCAPTCHA', 'signInMessage');
  return;
}

// VERIFY USING GOOGLE APPS SCRIPT
const verify = await fetch("YOUR_APPS_SCRIPT_URL", {
  method: "POST",
  body: JSON.stringify({ token: recaptchaResponse })
});

const result = await verify.json();

if (!result.success) {
  showMessage('reCAPTCHA verification failed', 'signInMessage');
  return;
}

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      localStorage.setItem('loggedInUserId', user.uid);
      showMessage('Login successful', 'signInMessage');
      window.location.href = 'homepage.html';
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account does not Exist', 'signInMessage');
      }
    });
});
