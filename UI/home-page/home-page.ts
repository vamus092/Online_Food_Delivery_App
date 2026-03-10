import { ChangeDetectorRef, Component } from '@angular/core';
import { MenuService } from '../services/menu-service';
import { MenuSection } from '../model/menuSection';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';
import { RestaurantService } from '../services/restaurant-service';
@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  constructor(private userService: UserService, private menuService: MenuService, private restaurantService: RestaurantService, private router: Router, private cdr: ChangeDetectorRef) { }
  menuSections !: any[];
  currentUser !: UserModel | null;
  subscription: any;

  allRestaurants: any[] = [];
  paginatedRestaurants: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 0;
  pagesArray: number[] = [];

ngOnInit(): void {

 this.restaurantService.getAllRestaurant().subscribe({
      next: (response) => {
        console.log("Restaurant details fetched ...", response);
        this.allRestaurants = response.data;
        console.log("Restaurant ....");
        console.log(this.allRestaurants);
        this.calculatePagination();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error occurred while fetching restaurant details ...", err);
      }
    })
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.allRestaurants.length / this.itemsPerPage);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedRestaurants();
  }

  updatePaginatedRestaurants(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRestaurants = this.allRestaurants.slice(startIndex, endIndex);
    console.log("Paginated Restaurant...")
    console.log(this.paginatedRestaurants);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRestaurants();

      // Optional: Smooth scroll back to the top of the restaurant list
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  onRestaurantClick(name: string, resId: string) {
    console.log("resId: ", resId);
    this.router.navigate(['restaurant-section', resId, name]);
  }

  navigateToSection(sectionName: string) {
    this.router.navigate(['/section-items', sectionName]);
  }

  ngOnDestory() {
    this.subscription.unsubscribe();
  }

}  
