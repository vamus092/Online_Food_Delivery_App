import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../services/restaurant-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-restaurant',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-restaurant.html',
  styleUrl: './add-restaurant.css',
})
export class AddRestaurant {
  showSuccess = false;

  constructor(private restaurantService: RestaurantService, private cdr: ChangeDetectorRef, private router: Router) { }
  // List of Indian States
  states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  restaurant = {
    restaurantName: '',
    address: {
      landmark: '',
      district: '',
      state: '' // This will bind to the dropdown
    },
    contactNumber: '',
    openingHours: { open: '', close: '' },
    isOperating: true
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log("Restaurent to be addeed", form.value);
      console.log('Restaurant Registered:', this.restaurant);
      const { open, close } = this.restaurant.openingHours;
      if (open >= close) {
        alert('Closing time must be later than opening time');
        return;
      }
      let payload = {
        restaurantName: form.value.restaurantName,
        address: {
          landmark: form.value.landmark,
          district: form.value.district,
          state: form.value.state,
        },
        contactNumber: form.value.contactNumber,
        openingHours: { open: form.value.openTime, close: form.value.closeTime },
        isOperating: form.value.isOperating
      }
      this.restaurantService.addRestaurant(payload).subscribe({
        next: (response) => {
          console.log("Restaurent Added successfully...", response);
          this.cdr.detectChanges();
          this.router.navigate(['/'])
        },
        error: (err) => {
          console.error("Error occurred while adding restaurent...", err);
        }
      })
      this.showSuccess = true;
      form.resetForm({ isOperating: true });
      setTimeout(() => { this.showSuccess = false; }, 3000);
    }
  }
}