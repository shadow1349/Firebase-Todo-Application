import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  // **shrug**
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  logIn(e: Event) {
    e.preventDefault();

    if (!this.loginForm.invalid) {
      alert('Please fill in the login form');
      return null;
    }

    return this.auth.loginWithEmail(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    );
  }

  signUp(e: Event) {
    e.preventDefault();

    if (!this.registerForm.invalid) {
      alert('Please fill in the login form');
      return null;
    }

    return this.auth.registerWithEmail(
      this.registerForm.controls['email'].value,
      this.registerForm.controls['password'].value
    );
  }

  googleAuth() {}
}
