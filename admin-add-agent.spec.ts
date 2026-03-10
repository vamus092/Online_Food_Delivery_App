import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddAgent } from './admin-add-agent';

describe('AdminAddAgent', () => {
  let component: AdminAddAgent;
  let fixture: ComponentFixture<AdminAddAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddAgent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
