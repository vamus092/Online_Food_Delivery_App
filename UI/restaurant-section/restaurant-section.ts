import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-restaurant-section',
  imports: [CommonModule],
  templateUrl: './restaurant-section.html',
  styleUrl: './restaurant-section.css',
})
export class RestaurantSection {

  restaurantName: string | null = '';
  restaurantId : string  = '';
  // These are your menu sections
  menuSections = [
    { title: 'Starters', icon: '🥗', image: 'assets/starters.jpg' },
    { title: 'Main Course', icon: '🍛', image: 'assets/main.jpg' },
    { title: 'Desserts', icon: '🍰', image: 'assets/desserts.jpg' },
    { title: 'Beverages', icon: '🥤', image: 'assets/drinks.jpg' }
  ];

  constructor(private route: ActivatedRoute,private router:Router) {}

  ngOnInit(): void {
    // Get the name from the URL: /restaurant/Bistro%20Delicious
    this.restaurantName = this.route.snapshot.paramMap.get('name');
    this.restaurantId = this.route.snapshot.paramMap.get('resId')!;
    console.log("Inside restaurant Section ....");
    console.log(this.restaurantId);
    console.log(this.restaurantName);
  }


  navigateToSection(resId:string,sectionName:string|null){
       this.router.navigate(['/section-items',resId,sectionName]);
  }
}
