import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPage } from './admin-page';
import { DeliveryService } from '../services/delivery-service';
import { OrderService } from '../services/order-service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AdminPage Two Test Cases', () => {//define test suite
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;
  let deliveryServiceMock: any;
  let orderServiceMock: any;

  beforeEach(async () => {
    // 1. CLEAR PREVIOUS HISTORY 
    vi.clearAllMocks();
    // 1. Mock dependencies
    deliveryServiceMock = {
      getAnyAvailableAgent: vi.fn().mockReturnValue([]),
      anyAgentsAvailable: vi.fn().mockReturnValue(true),
      setAgentAvailability: vi.fn(),
    };
    orderServiceMock = {
      getOrders: vi.fn().mockReturnValue([]),//vi.fn() to create spies
      updateAgent: vi.fn(),
      updateOrderStatus: vi.fn(),
    };

    // 2. Creates dynamic angular Module for testing
    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [
        { provide: DeliveryService, useValue: deliveryServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);//create component instance
    component = fixture.componentInstance;
    vi.spyOn(window, 'alert').mockImplementation(() => {}); // Silence alerts
    fixture.detectChanges();
  });

  //  POSITIVE TEST CASE 
  it('Positive: handleAccept should assign agent and update status when an agent is selected', () => {
    // Arrange: Set up the scenario where an agent is selected
    const orderId = '101';
    const mockAgent = { id: 91, name: 'Agent Smith', available: true };
    component.selectedAgentsMap[orderId] = mockAgent;

    // Act: Call the function
    component.handleAccept(orderId);

    // Assert: Verify success actions happened
    expect(deliveryServiceMock.setAgentAvailability).toHaveBeenCalledWith(91, false);
    expect(orderServiceMock.updateOrderStatus).toHaveBeenCalledWith(orderId, 'Accepted');
    expect(window.alert).toHaveBeenCalled(); // Alert was shown
    expect(component.selectedAgentsMap[orderId]).toBeNull(); // Selection cleared
  });

  // NEGATIVE TEST CASE 
  it('Negative: handleAccept should NOT call any services if no agent is selected', () => {
    // Arrange: Set up the scenario where the dropdown is empty (null/undefined)
    const orderId = '102';
    component.selectedAgentsMap[orderId] = null;

    // Act: Call the function
    component.handleAccept(orderId);

    // Assert: Verify NO actions happened
    expect(deliveryServiceMock.setAgentAvailability).not.toHaveBeenCalled();
    expect(orderServiceMock.updateOrderStatus).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });
});