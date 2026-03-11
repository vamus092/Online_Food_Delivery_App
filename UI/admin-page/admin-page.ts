import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeliveryService } from '../services/delivery-service';
import { DeliveryAgent } from '../model/deliveryAgent';
import { CommonModule } from '@angular/common';
import { Order } from '../model/orderModel';
import { OrderService } from '../services/order-service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user-service';
import { UserModel } from '../model/UserModel';


@Component({
    selector: 'app-admin-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-page.html',
    styleUrl: './admin-page.css',
})
export class AdminPage implements OnInit {
    agents: any[] = [];
    Orders: any[] = [];
    //agentName !: string;
    currentUser !: UserModel;
    selectedStatus: string = 'All';//dropdown default value
    selectedAgentsMap: { [key: string]: any | null } = {};
    isAnyAgentAvailable: boolean = false;

    constructor(
        private deliveryService: DeliveryService,
        private orderService: OrderService,
        private userService: UserService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.userService.getUserProfile().subscribe({
            next: (response: any) => {
                console.log("Inside APP component ...", response);
                this.currentUser = response.response.data;
                this.cdr.detectChanges();
                this.orderService.getAllOrders('createdAt', 'asc').subscribe({
                    next: (response) => {
                        console.log("Orders fetched ...", response);
                        this.Orders = response.data
                        this.cdr.detectChanges();
                        this.deliveryService.getAllAgents(true).subscribe({
                            next: (response) => {
                                console.log("All agents fetched...", response);
                                this.agents = response.data;
                                if (this.agents.length > 0) {
                                    this.isAnyAgentAvailable = false;
                                }
                                else {
                                    this.isAnyAgentAvailable = true;
                                }
                                console.log(this.agents);
                                this.cdr.detectChanges();
                            },
                            error: (err) => {

                            }
                        })
                    },
                    error: (err) => {
                        console.error("Error Occurred while fetching orders...", err);
                    }
                })
            },
            error: (err: any) => {
                console.error("Error Occurred While Login ...", err);
            }
        })


    }

    



    handleAccept(orderId: string, status: string) {
        const agent = this.selectedAgentsMap[orderId];
        console.log("Handle Agents....");
        console.log(agent);
        console.log(agent._id);
        if (agent) {
            //this.deliveryService.setAgentAvailability(agent.id, false);
            this.deliveryService.assignDeliveryAgent(orderId, agent._id, status).subscribe({
                next: (response) => {
                    console.log("Delivery Status Changed Successfully ....", response);
                    //this.agentName = response.data.agentAssigned.agentName;
                    alert(`Order ${orderId} accepted and assigned to ${response.data.agentAssigned.agentName}.`);
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error("Error occurred while changing delivery status...", err);
                }
            })
        }
    }

    handelReject(orderId: string, status: string) {//reject status update and alert
        this.orderService.changeDeliveryStaus(orderId, status).subscribe({
            next: (response) => {
                console.log("order Status changed Successfully...", response);
                const index = this.Orders.findIndex(o => o._id === orderId);
                if (index !== -1) {
                    this.Orders = [
                        ...this.Orders.slice(0, index),
                        response.data,
                        ...this.Orders.slice(index + 1)
                    ];
                }
                alert("Order`s status updated to " + status);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error("Error Occurred While Changing order status...", err);
            }
        })


    }

    filterOrders() {
         this.orderService.filterOrders(this.selectedStatus).subscribe({
            next:(response)=>{
                  console.log("Orders filtered Successfully...",response);
                  this.Orders = response.data;
                  this.cdr.detectChanges();
            },
            error:(err)=>{
                 console.error("Error Occured While filtering the orders",err)
            }
         })
    }
    
}

