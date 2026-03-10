import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRestaurant } from './add-restaurant';

describe('AddRestaurant', () => {
  let component: AddRestaurant;
  let fixture: ComponentFixture<AddRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
