import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/user';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          console.log(user);
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
        } else {
          localStorage.setItem('user', null);
        }
      });
    }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('logged-in');
        this.setUserData(result.user); // save user data
        this.router.navigate(['/']); // redirect to home
      }).catch((error) => {
        console.log(error.message);
      });
  }

  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('registered');
        this.setUserData(result.user);
        this.router.navigate(['/']); // redirect to home
      }).catch((error) => {
        console.log(error.message);
      });
  }

  get isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null /*&& user.emailVerified !== false*/) ? user.email : false;
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.displayName
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  logout() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      console.log('out');
    });
  }

}

