
import { ChangeDetectorRef, Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserService } from '../services/user-service';
import { RestaurantService } from '../services/restaurant-service';
import { MenuService } from '../services/menu-service';
import { FormsModule } from '@angular/forms';
import LocomotiveScroll from 'locomotive-scroll';

import { Carousel } from "../carousel/carousel";
import { Menucar } from "../menucar/menucar";
// import { Feedback } from "../feedback/feedback";
import { Ad } from "../ad/ad";
import { Horizon } from "../horizon/horizon";
import { Chefspl } from "../chefspl/chefspl";



@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Ad, Horizon, Carousel, Menucar, Chefspl],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit { 
  // --- Pagination Properties ---
  allRestaurants: any[] = [];
  paginatedRestaurants: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3; 
  totalPages: number = 0;
  pagesArray: number[] = [];
  
  // --- Search Properties ---
  searchTerm: string = '';
  filteredResults: any[] = [];
  private searchSubject = new Subject<string>();
  private subscription: Subscription = new Subscription();

  // --- Theme Property ---
  isDarkMode: boolean = true;

  // --- NEW: Scroll Instance ---
  private scroll: any;
  activeMenuId: string = '1'; 
  scrollProgress: number = 0;

  constructor(
    private userService: UserService, 
    private menuService: MenuService, 
    private restaurantService: RestaurantService, 
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private el: ElementRef
  ) { }

ngAfterViewInit(): void {
  this.initScroll();
}

private initScroll(): void {
  const scrollContainer = this.el.nativeElement.querySelector('[data-scroll-container]');
  
  if (scrollContainer) {
    this.scroll = new (LocomotiveScroll as any)({
      el: scrollContainer,
      smooth: true,
      multiplier: 1,
      lerp: 0.1
    });

    // Important: Listen for scroll updates to handle progress
    this.scroll.on('scroll', (args: any) => {
      this.scrollProgress = args.progress * 100;
      this.cdr.detectChanges();
    });
  }
}

private initImmersiveObserver(): void {
  const observerOptions = {
    root: null,
    // Negative margin creates a "center-screen" trigger zone
    rootMargin: '-35% 0px -35% 0px', 
    threshold: 0 
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-scroll-id');
        
        if (id && this.activeMenuId !== id) {
          console.log('Switching to Dish:', id);
          this.activeMenuId = id;
          
          // Trigger the image swap
          this.changeMenuImage(id);

          // Handle Text highlighting (Glassmorphism)
          const blocks = document.querySelectorAll('.text-block');
          blocks.forEach(b => b.classList.remove('is-inview'));
          entry.target.classList.add('is-inview');
          
          this.cdr.detectChanges();
        }
      }
    });
  }, observerOptions);

  // 3. START WATCHING THE BLOCKS
  const textBlocks = document.querySelectorAll('.text-block');
  textBlocks.forEach(block => observer.observe(block));
}

// Keep your changeMenuImage method as is
changeMenuImage(id: string) {
  const images = document.querySelectorAll('.menu-image');
  images.forEach(img => img.classList.remove('active'));
  
  const target = document.querySelector(`#img-${id}`);
  if (target) {
    target.classList.add('active');
  }
}

  
ngOnInit(): void {
  this.checkTheme();

  const resSub = this.restaurantService.getAllRestaurant().subscribe({
    next: (response: any) => {
      this.allRestaurants = response.data;
      this.calculatePagination();
      
      // 1. Tell Angular to update the DOM
      this.cdr.detectChanges();
      
      // 2. Wait for the next "tick" so the DOM is actually rendered
      // 3. Then tell Locomotive and Observer to look at the new elements
      setTimeout(() => {
        this.scroll?.update();
        this.initImmersiveObserver(); // Re-run this so it sees the new list
      }, 100); 
    },
    error: (err) => console.error('Failed to load restaurants:', err)
  });
  
  this.subscription.add(resSub);

    this.subscription.add(
      this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
        this.processGlobalSearch(term);
        // Update scroll after search results change DOM
        setTimeout(() => this.scroll?.update(), 100);
      })
    );
  }

  checkTheme(): void {
    const savedTheme = localStorage.getItem('theme-preference');
    this.isDarkMode = savedTheme === 'dark' || !savedTheme;
  }

  onSearchChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.searchTerm = element.value;
    this.searchSubject.next(this.searchTerm);
  }

  processGlobalSearch(term: string): void {
    const query = term.toLowerCase().trim();
    if (query === 'orders') {
      this.router.navigate(['/orders']); 
      return;
    }
    if (!query) {
      this.filteredResults = [];
      this.calculatePagination(); 
    } else {
      this.filteredResults = this.allRestaurants.filter(res => 
        res.restaurantName.toLowerCase().includes(query) ||
        res.address.district.toLowerCase().includes(query)
      );
      this.paginatedRestaurants = this.filteredResults.slice(0, 3);
    }
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredResults = [];
    this.calculatePagination();
    this.cdr.detectChanges();
    setTimeout(() => this.scroll?.update(), 100);
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
  }

  goToPage(page: number): void {
    if (this.searchTerm) return; 
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRestaurants();
      // Use Locomotive's scroll method instead of window.scrollTo
      this.scroll?.scrollTo(400); 
    }
  }

  onRestaurantClick(name: string, resId: string) {
    this.searchTerm = '';
    this.filteredResults = [];
    this.router.navigate(['restaurant-section', resId, name]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // Destroy scroll instance to prevent memory leaks
    if (this.scroll) {
      this.scroll.destroy();
    }
  }
}
