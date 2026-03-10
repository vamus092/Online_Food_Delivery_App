import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../services/user-service';
import { Router, RouterLink } from '@angular/router';
import { dateValidator } from '../directive/dateValidator';
import { phoneNumberValidator } from '../directive/phoneNumberValidator';
import { confirmPasswordValidator } from '../directive/confirmPassword';
import { passwordValidator } from '../directive/passwordValidator';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {customEmailValidator}  from '../directive/emailValidator'
import { zipCodeValidator } from '../directive/zipCode';

@Component({
  selector: 'app-signup-page',
  imports: [FormsModule, CommonModule, RouterLink,ReactiveFormsModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})

export class SignupPage {
   // List of Indian States
  states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];
  signupForm!: FormGroup;
  constructor( private fb: FormBuilder, private userservice: UserService, private router: Router) { }
  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required], 
        email: ['', [Validators.required,new customEmailValidator()]],
        dateofBirth: ['', [Validators.required,new dateValidator()]],
        phoneNumber: ['', [Validators.required,new phoneNumberValidator()]],
        password: ['', [Validators.required,new passwordValidator()]], 
        confirmPassword: ['', [Validators.required,new confirmPasswordValidator()]],
        role: [''],
        address: this.fb.group({
          flatNo: ['', Validators.required],
          landmark: ['', Validators.required],
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          district: [''],
          zipCode: ['', [Validators.required,new zipCodeValidator()]]
        })
      });
  }

  onSubmit() {
  if (this.signupForm.valid) { 
    // Create a copy of the form values
    const userData = { ...this.signupForm.value };

    // Convert the string date into a real Date object
    if (userData.dateofBirth) {
      userData.dateofBirth = new Date(userData.dateofBirth);
    }

    console.log('Form Prepared for Backend:', userData);

    this.userservice.createUser(userData).subscribe({
      next: (response) => {
        alert("Registration successful!");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Error occurred during registration:", err);
      }
    });
  }
}

}

