import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chefspl } from './chefspl';

describe('Chefspl', () => {
  let component: Chefspl;
  let fixture: ComponentFixture<Chefspl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chefspl],
    }).compileComponents();

    fixture = TestBed.createComponent(Chefspl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
