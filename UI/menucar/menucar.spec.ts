import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menucar } from './menucar';

describe('Menucar', () => {
  let component: Menucar;
  let fixture: ComponentFixture<Menucar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menucar],
    }).compileComponents();

    fixture = TestBed.createComponent(Menucar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
