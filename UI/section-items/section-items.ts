import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MenuService } from '../services/menu-service';
import { MenuModel } from '../model/menuModel';
import { CommonModule } from '@angular/common';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';
//import { ViewCartService } from '../services/view-cart-service';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../services/restaurant-service';
import { ViewCartService } from '../services/view-cart-service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime,switchMap,distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-section-items',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './section-items.html',
  styleUrl: './section-items.css',
})

export class SectionItems {
  sectionName!: string;
  items: MenuModel[] = [];
  menuItems !: MenuModel[];
  currentUser !: UserModel;
  subscription:any;
  searchTerm: string = '';
  restaurantId: string = '';
  menuId : string = '';
  searchControl = new FormControl('');
  constructor(private menuService: MenuService,private viewCartService:ViewCartService,private restaurantService:RestaurantService,private userService: UserService, private route: ActivatedRoute, private router: Router,private cdr:ChangeDetectorRef) { }
  
  ngOnInit(): void {

    this.sectionName = this.route.snapshot.paramMap.get('sectionName')!;
    this.restaurantId = this.route.snapshot.paramMap.get('resId')!;
     
    this.menuService.getMenuBySectionName(this.restaurantId,this.sectionName).subscribe({
        next:(response)=>{
              console.log(`For ${this.restaurantId} menu Items are found...`,response);
              this.menuId = response.data.menus[0]._id; 
              console.log("Menu Id ...");
              console.log(this.menuId);
              console.log(response.data.menus[0].items);
              this.menuItems  = response.data.menus[0].items;
              console.log("Menu items found ........");
              console.log(this.menuItems);
              this.cdr.detectChanges();
        },
        error:(err)=>{
           console.error(`Error Occurred while fetched menuItems for ${this.restaurantId}`,err);
        }
    })
    
    this.userService.getUserProfile().subscribe({
       next:(response)=>{
            console.log('User Details fetched Successful Inside Section Component...',response);
            this.currentUser = response.response.data
            this.cdr.detectChanges();
      },
      error:(err)=>{
          console.error("Error Occurred While Log out...",err);
      }
     })


  this.searchControl.valueChanges.pipe(
    debounceTime(500),          // wait 500ms after typing stops
    distinctUntilChanged(),     // only fire if value changed
    switchMap(term => {
      if (term && term.trim() !== '') {
        return this.menuService.searchMenuitems(this.restaurantId, this.sectionName, term);
      } else {
        return this.menuService.getMenuBySectionName(this.restaurantId, this.sectionName);
      }
    })
  ).subscribe((response :any)=> {
    // this.menuItems = response;
    if(response.searchedData){
         this.menuItems = response.searchedData;
    }
    else if (response.data && response.data.menus) {
    // when searchTerm is empty, backend returns menus array
    // menus is an array of sections, so take the first one and its items
    const menus = response.data.menus;
    if (menus.length > 0) {
      this.menuItems = menus[0].items;   // assign the items array
    } else {
      this.menuItems = [];
    }
  }
    console.log("Searched Item ...",response);
    this.cdr.detectChanges();
  });
  }

  
  
handleEdit(itemId: string) {
    this.router.navigate(['/editMenu', itemId])
}


handleDelete(itemId: string) {
  const userConfirmed = confirm("Are you sure you want to delete this menu item?");
  
  if (userConfirmed) {
    this.menuService.deleteMenuItem(this.menuId, itemId).subscribe({
      next: (response) => {
        console.log("Menu item deleted successfully:", response);

        // Remove the deleted item from the local list so UI updates immediately
        this.menuItems = this.menuItems.filter(item => item._id !== itemId);

        alert("Item deleted successfully.");
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error occurred while deleting menu item...", err);
        alert("Failed to delete item. Please try again.");
      }
    });
  } else {
    alert("Deletion cancelled by user.");
  }
}


handleAddToCart(itemId: string) {
    if (!this.currentUser) {
      alert("Currently You are not Logged-in!")
      this.router.navigate(['/login']);
    }
     else{
         this.viewCartService.addToCart(itemId); 
         alert("Item added to the Cart!")
     }
}

naviagteTo(){
  this.router.navigate(['/'])
}
  
   ngOnDestory(){
        this.subscription.unsubscribe();
    }
}