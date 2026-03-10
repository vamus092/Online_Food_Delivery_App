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
    address: { flatNo: 0, landmark: '', street: '', city: '', state: '', zipCode: '', district: '' },
    phoneNumber: '',
    role: ''
  };

  originalUser!: UserModel;

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
      console.log("Form value changed...");
      console.log(val);
      this.currentUser = { ...val };
      // console.log("The Current User...")
      // console.log(this.currentUser);
      // console.log("The Original List...");
      // console.log(this.originalUser);

    })


    this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
            console.log("Inside APP component ...",response);
              this.currentUser = response.response.data;
              this.originalUser = response.response.data;

        this.editForm.patchValue({
          username: this.currentUser.username ?? '',
          email: this.currentUser.email ?? '',
          dateofBirth: this.currentUser.dateofBirth ?? '',
          phoneNumber: this.currentUser.phoneNumber ?? '',
          role: this.currentUser.role ?? '',
          address: {
            flatNo: this.currentUser.address?.flatNo ?? 0,
            landmark: this.currentUser.address?.landmark ?? '',
            street: this.currentUser.address?.street ?? '',
            city: this.currentUser.address?.city ?? '',
            state: this.currentUser.address?.state ?? '',
            district: this.currentUser.address?.district ?? '',
            zipCode: this.currentUser.address?.zipCode ?? '',
          }
          })

              this.cdr.detectChanges();
         },
         error:(err:any)=>{
           console.error("Error Occurred While Login ...",err);
         }
    })
  

  }

  isChanged(): boolean {
    if (!this.currentUser || !this.originalUser) {
      return false;
    }
    else {
      // console.log("The Current User...")
      // console.log(this.currentUser);
      // console.log("The Original List...");
      // console.log(this.originalUser);
      return JSON.stringify(this.currentUser) !== JSON.stringify(this.originalUser);
    }

  }
  updatedUser !: UserModel;
  onSubmit() {
    console.log("Inside on submit Handler...")
    console.log(this.currentUser);
    console.log(this.originalUser._id);
    console.log("Edit Profile Data....");
    console.log(this.editForm.value);
   
    this.userService.updateUser(this.originalUser._id,this.editForm.value).subscribe({
        next : (response)=>{
           console.log("User profile edited successfully ",response);
        },
        error:(err)=>{
           console.error("Error occurred while profile edit ... ",err);
        }
    })
     
    this.router.navigate(['/']);
  }
}




