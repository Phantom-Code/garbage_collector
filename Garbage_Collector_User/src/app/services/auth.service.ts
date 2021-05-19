import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(public fireAuth: AngularFireAuth) {}

  async signUp(email: string, password: string) {
    const temp = await this.fireAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.user = temp.user;
    return temp.user;
  }
  async signIn(email: string, password: string) {
    const temp = await this.fireAuth.signInWithEmailAndPassword(
      email,
      password
    );
    this.user = temp.user;
    return temp.user;
  }
  isLoggedIn() {
    return this.user != undefined;
  }
  async getUser() {
    const temp = await this.fireAuth.authState;
    return temp;
  }
  async authChanged() {
    await this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        // User is signed out
        console.log('no user');
        this.user = undefined;
      }
    });
  }
}
