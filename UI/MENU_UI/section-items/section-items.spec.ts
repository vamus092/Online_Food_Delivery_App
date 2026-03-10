import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionItems } from './section-items';

describe('SectionItems', () => {
  let component: SectionItems;
  let fixture: ComponentFixture<SectionItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
