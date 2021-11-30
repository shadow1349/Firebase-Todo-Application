import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

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

    if (this.loginForm.invalid) {
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

    if (this.registerForm.invalid) {
      alert('Please fill in the register form');
      return null;
    }

    return this.auth.registerWithEmail(
      this.registerForm.controls['email'].value,
      this.registerForm.controls['password'].value
    );
  }

  googleAuth(type: 'sign-in' | 'sign-up') {
    return this.auth.googleAuth(type);
  }

  async forgotPassword() {
    let email = '';
    if (this.loginForm.controls['email'].value) {
      email = this.loginForm.controls['email'].value;
    } else {
      const result = await Swal.fire({
        title: 'Enter your email address',
        input: 'email',
        inputLabel: 'email address',
        showCancelButton: true,
        cancelButtonColor: 'red',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a valid email address';
          }
          return null;
        },
      });

      if (result.value) email = result.value;
    }

    if (email) {
      await this.auth.forgotPassword(email);

      Swal.fire(
        'Sent password reset email',
        'Please check your inbox for a password reset link',
        'success'
      );
    }
  }
}
