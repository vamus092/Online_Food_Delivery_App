import { CommonModule, Location } from '@angular/common'; // Added Location
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { customEmailValidator } from '../directive/emailValidator';
import { passwordValidator } from '../directive/passwordValidator';

@Component({
  selector: 'app-login-page',
  standalone: true, // Assuming standalone based on your imports
  imports: [FormsModule, CommonModule, customEmailValidator, passwordValidator],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  // Injected location service for the back button
  constructor(
    private userservice: UserService, 
    private router: Router,
    private location: Location 
  ) { }

  onSubmit(myForm: NgForm) {
    console.log("Form data", myForm.value);

    this.userservice.loginUser(myForm.value).subscribe({
       next:(response)=>{
            console.log("User Logged in successfully ...", response);
            this.router.navigate(['/']);
       },
       error:(err)=>{
              alert("Invalid credentials");
              console.log("Login failed ...", err);
       }
    });
  }

  redirectToSignup() {
    this.router.navigate(['/signup']);
  }

  // Back button logic
  goBack() {
    this.location.back();
  }
}
