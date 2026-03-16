import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Horizon } from './horizon';

describe('Horizon', () => {
  let component: Horizon;
  let fixture: ComponentFixture<Horizon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Horizon],
    }).compileComponents();

    fixture = TestBed.createComponent(Horizon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
