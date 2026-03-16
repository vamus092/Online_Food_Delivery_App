 
import { ChangeDetectorRef, Component } from '@angular/core';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { customEmailValidator } from '../directive/emailValidator';
import { dateValidator } from '../directive/dateValidator';
import { phoneNumberValidator } from '../directive/phoneNumberValidator';
import { zipCodeValidator } from '../directive/zipCode';
 
@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  currentUser: UserModel = {
    _id: '',
    username: '',
    email: '',
    dateofBirth: '',
    password: '',
    address: { flatNo: '', landmark: '', street: '', city: '', state: '', zipCode: '', district: '' },
    phoneNumber: '',
    role: ''
  };
 
  originalUser!: UserModel;
  initialFormState: any; // Added to strictly track form changes
 
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private cdr : ChangeDetectorRef) { }
  editForm !: FormGroup;
 
  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: [this.currentUser.username || '', Validators.required],
      email: [this.currentUser.email || '', [Validators.required, new customEmailValidator()]],
      dateofBirth: [this.currentUser.dateofBirth || '', [new dateValidator()]],
      phoneNumber: [this.currentUser.phoneNumber || '', [new phoneNumberValidator()]],
      role: [this.currentUser.role || '', Validators.required],
      address: this.fb.group({
        flatNo: [this.currentUser.address?.flatNo || '', Validators.required],
        landmark: [this.currentUser.address?.landmark || '', Validators.required],
        street: [this.currentUser.address?.street || '', Validators.required],
        city: [this.currentUser.address?.city || '', Validators.required],
        state: [this.currentUser.address?.state || '', Validators.required],
        district: [this.currentUser.address?.district || ''],
        zipCode: [this.currentUser.address?.zipCode || '', [Validators.required, new zipCodeValidator()]]
      })
    });
 
    this.editForm.valueChanges.subscribe((val) => {
      this.currentUser = { ...this.currentUser, ...val };
    });
 
    this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
              console.log("Inside APP component ...",response);
              this.currentUser = response.response.data;
              this.originalUser = response.response.data;
 
              // FIX: Format the Date to YYYY-MM-DD so HTML <input type="date"> can read it
              let formattedDob = '';
              if (this.originalUser.dateofBirth) {
                  formattedDob = new Date(this.originalUser.dateofBirth).toISOString().split('T')[0];
              }
 
              this.editForm.patchValue({
                username: this.currentUser.username ?? '',
                email: this.currentUser.email ?? '',
                dateofBirth: formattedDob, // Apply formatted date here
                phoneNumber: this.currentUser.phoneNumber ?? '',
                role: this.currentUser.role ?? '',
                address: {
                  flatNo: this.currentUser.address?.flatNo ?? '', // Use '' instead of 0 to match string types
                  landmark: this.currentUser.address?.landmark ?? '',
                  street: this.currentUser.address?.street ?? '',
                  city: this.currentUser.address?.city ?? '',
                  state: this.currentUser.address?.state ?? '',
                  district: this.currentUser.address?.district ?? '',
                  zipCode: this.currentUser.address?.zipCode ?? '',
                }
              });
 
              // FIX: Capture the exact state of the form after it loads the backend data
              this.initialFormState = this.editForm.value;
 
              this.cdr.detectChanges();
         },
         error:(err:any)=>{
           console.error("Error Occurred While Loading Profile ...",err);
         }
    });
  }
 
  isChanged(): boolean {
    // FIX: Compare the current form value strictly against the initial form state
    if (!this.initialFormState) return false;
    return JSON.stringify(this.editForm.value) !== JSON.stringify(this.initialFormState);
  }
 
  onSubmit() {
    if (this.editForm.invalid) return;
 
    this.userService.updateUser(this.originalUser._id, this.editForm.value).subscribe({
        next : (response)=>{
           console.log("User profile edited successfully ",response);
           alert("Profile updated successfully!");
           this.router.navigate(['/']);
        },
        error:(err)=>{
           console.error("Error occurred while profile edit ... ",err);
           alert("Failed to update profile.");
        }
    });
  }
}
