import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelManagerOrderPage } from './hotel-manager-order-page';

describe('HotelManagerOrderPage', () => {
  let component: HotelManagerOrderPage;
  let fixture: ComponentFixture<HotelManagerOrderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelManagerOrderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelManagerOrderPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
