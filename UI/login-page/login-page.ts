import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { customEmailValidator } from '../directive/emailValidator';
import { passwordValidator } from '../directive/passwordValidator';
@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule, customEmailValidator, passwordValidator],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  constructor(private userservice: UserService, private router: Router) { }
  onSubmit(myForm: NgForm) {
    console.log("Form data");
    console.log(myForm.value);
      // let user: boolean = this.userservice.validateUser(myForm.value.email, myForm.value.password);
    //   if (user) {
    //     console.log("List of users inside ...");
    //     console.log(this.userservice.getUsers());
    //     alert("Login Successful ...");
    //     this.router.navigate(['/'])
    //   }
    //   else {
    //     alert("Login failed - Invalid Credentials...");
    //   }

    this.userservice.loginUser(myForm.value).subscribe({
       next:(response)=>{
            console.log("User Logged in successfully ...",response);
            this.router.navigate(['/'])
       },
       error:(err)=>{
              console.log("Login failed ...",err)
       }
    })

  }

  redirectToSignup() {
    this.router.navigate(['/signup'])
  }
}
