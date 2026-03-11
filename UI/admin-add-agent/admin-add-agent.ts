import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryService } from '../services/delivery-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-agent',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-agent.html',
  styleUrl: './admin-add-agent.css',
})
export class AdminAddAgent {showSuccess = false;

  constructor(private deliveryService:DeliveryService,private router:Router){}
  agent = {
    agentName: '',
    phoneNumber: '',
    availability: true
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Agent Data Saved:', this.agent);
      this.deliveryService.createAgent(this.agent).subscribe({
        next:(response)=>{
           console.log("Agent added Successfully...",response);
           alert("Agent added Successfully");
           this.router.navigate(['/']);

        },
        error:(err)=>{
             console.error("Error Occurred while addinhg agent...",err);
        }
      })

      this.showSuccess = true;
      form.resetForm({ availability: true });

      // Hide message after 3 seconds
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }
  }
}