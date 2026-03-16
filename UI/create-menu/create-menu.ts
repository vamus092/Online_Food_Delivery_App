import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { nonNegativePriceDirective } from '../directive/negativePriceValidator';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';
import { RestaurantService } from '../services/restaurant-service';
import { MenuService } from '../services/menu-service';

@Component({
    selector: 'app-create-menu',
    imports: [FormsModule, CommonModule, nonNegativePriceDirective],
    templateUrl: './create-menu.html',
    styleUrl: './create-menu.css',
})
export class CreateMenu {
    currentUser !: UserModel;
    restaurantId: any;
    selectedFile: File | null = null;
    allrestaurant !: any;

    constructor(
        private restaurantService: RestaurantService,
        private userService: UserService,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    ngOnInit() {

        this.userService.getUserProfile().subscribe({
            next: (response: any) => {
                console.log("Inside create Menu component ...", response);
                this.currentUser = response.response.data;
                console.log("Current User inside create  Menu...",this.currentUser);
                this.cdr.detectChanges();
                if (this.currentUser) {
            this.restaurantService.getRestaurantByID(this.currentUser._id).subscribe({
                next: (response: any) => {
                    console.log("Restaurant Fetched Inside create Menu...", response);
                    this.restaurantId = response.data[0]._id;
                    this.allrestaurant = response.data;
                    console.log(this.restaurantId);
                    console.log(this.allrestaurant);
                    this.cdr.detectChanges();
                },
                error: (err: any) => {
                    console.error("Error while fetching Restaurant Details...", err)
                }
            })
        }

            },
            error: (err: any) => {
                console.error("Error Occurred While Login ...", err);
            }
        })

        
    }

    handleSubmit(myForm: NgForm) {
        console.log("New Menu...");
        console.log(myForm.value);
        if (myForm.value) {
            const formData = new FormData();
            formData.append('itemName', myForm.value.itemName);
            formData.append('description', myForm.value.description);
            formData.append('sectionName', myForm.value.sectionName);
            formData.append('price', myForm.value.price);

            if (this.selectedFile) {
                formData.append('image', this.selectedFile);
            }
            console.log("FORM Data:", formData);

            this.menuService.addMenu(this.restaurantId, formData).subscribe({
                next: (response: any) => {
                    console.log("Menu added successfully ...", response);
                    alert("New Menu Add Succesfully...");
                    this.router.navigate(['/']);
                },
                error: (err: any) => {
                    console.error("Error Occurred while creating Menu...", err);
                }
            })
        }
    }
}
