import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ad } from './ad';

describe('Ad', () => {
  let component: Ad;
  let fixture: ComponentFixture<Ad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ad],
    }).compileComponents();

    fixture = TestBed.createComponent(Ad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
