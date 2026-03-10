import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../services/menu-service';
import { MenuModel } from '../model/menuModel';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { nonNegativePriceDirective } from '../directive/negativePriceValidator';
@Component({
  selector: 'app-edit-menu',
  imports: [FormsModule,CommonModule,nonNegativePriceDirective],
  templateUrl: './edit-menu.html',
  styleUrl: './edit-menu.css',
})

export class EditMenu {
  menu: MenuModel = {
    _id: "",
    itemName: "",
    description: "",
    price: 0,
  };
  
  itemId !: string | null;
  constructor(private route: ActivatedRoute, private router: Router, private menuService: MenuService,private cdr : ChangeDetectorRef) { }
  ngOnInit(): void {
    this.route.params.subscribe((p)=>{
       this.itemId = p['id'];
    });
    if (this.itemId) {
      const item = this.menuService.getMenuById(this.itemId).subscribe({
        next:(response)=>{
            console.log("Menu to be edited inside edit component...",response);
            this.menu = response.data;
            this.cdr.detectChanges();
        },
        error:(err)=>{
            console.error("Error occurred while editing the menu...",err);
        }
      })

    }
  }

  update(formData: NgForm) {
    console.log("Menu details ...");
    console.log(formData.value);
    if (this.itemId) {
      this.menuService.editMenuItem(this.itemId, formData.value).subscribe({
         next:(response)=>{
             console.log("Menu edited succesfully ...",response);
              alert("Menu Edited Successfully ...");
              this.router.navigate(['/']);
         },
         error:(err)=>{
            console.error("Error Occurred while editing the menu ...",err)
         }

      })
     
    }
  }

}
