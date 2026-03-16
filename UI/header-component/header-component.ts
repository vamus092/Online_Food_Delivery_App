import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { UserService } from '../services/user-service'
import { UserModel } from '../model/UserModel';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewCartService } from '../services/view-cart-service';
@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
 
export class HeaderComponent {
  currentUser!: UserModel | null;
  isDropdownOpen = false;
  constructor(private viewCartService :ViewCartService,private userService: UserService, private cdr: ChangeDetectorRef, private router: Router) { }
 
  ngOnInit(): void {
    // Check if token cookie exists before hitting API
    const token = this.getCookie('token');
    // if (!token) {
    //   console.log('No token found, skipping getUserProfile call');
    //   this.currentUser = null;
    //   return;
    // }
 
    // this.userService.getUserProfile().subscribe({
    //   next: (response: any) => {
    //     console.log("Inside Header component ...", response);
    //     this.currentUser = response.response.data;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err: any) => {
    //     console.error("Error Occurred While Login ...", err);
    //   }
    // })
 
this.userService.getUserProfile().subscribe({
      next: (response: any) => {
        // Adjust this depending on exactly how your backend nests the data
        const userData = response.data || response.response?.data || response;
        console.log('User profile response in Header component:', userData);
        this.currentUser = userData;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user profile in App component:', error);
        this.currentUser = null;
        // If the token is expired/invalid, clear it out
        sessionStorage.clear();
      }
    });
 
 
    this.isDropdownOpen = false;
  }
 
  Logout() {
    this.userService.logoutUser().subscribe({
      next: (response: any) => {
        console.log('Loggout Successful...', response);
        this.cdr.detectChanges();
        alert("User logged out...");
        this.viewCartService.clearCart();
        localStorage.removeItem("cartItems");
 
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error("Error Occurred While Log out...", err);
      }
    })
  }
 
 
  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const cookie = cookies.find(c => c.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
 
}
