import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { ChangeDetectorRef, Component, signal } from '@angular/core'; 
import { UserService } from '../services/user-service'
import { UserModel } from '../model/UserModel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLinkActive,RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})

export class HeaderComponent {
   currentUser!: UserModel;
  isDropdownOpen = false;
  constructor(private userService: UserService,private cdr : ChangeDetectorRef,private router:Router) { }
  
  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
            console.log("Inside APP component ...",response);
              this.currentUser = response.response.data;
              this.cdr.detectChanges();
         },
         error:(err:any)=>{
           console.error("Error Occurred While Login ...",err);
         }
    })
     

    this.isDropdownOpen = false;
  }

  Logout() {
     this.userService.logoutUser().subscribe({
      next:(response:any)=>{
            console.log('Loggout Successful...',response);
            this.cdr.detectChanges();
            alert("User logged out...");
            this.router.navigate(['/login'])
      },
      error:(err:any)=>{
          console.error("Error Occurred While Log out...",err);
      }
     })
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
 
}
