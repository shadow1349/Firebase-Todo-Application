import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private analytics: AngularFireAnalytics,
    private router: Router
  ) {}

  loginWithEmail(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((credential) => this.handleAuth(credential, 'sign-in'));
  }

  registerWithEmail(email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => this.handleAuth(credential, 'sign-up'));
  }

  loginWithGoogle() {
    return this.googleAuth('sign-in');
  }

  registerWithGoogle() {
    return this.googleAuth('sign-up');
  }

  private googleAuth(type: 'sign-in' | 'sign-up') {
    return this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((credential) => this.handleAuth(credential, type));
  }

  private handleAuth(
    credential: firebase.auth.UserCredential,
    operation: 'sign-in' | 'sign-up'
  ) {
    this.analytics.logEvent(operation);

    if (credential.user) this.analytics.setUserId(credential.user.uid);

    return this.router.navigate(['/home']);
  }
}
