import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientdashComponent } from './clientdash.component';

describe('ClientdashComponent', () => {
  let component: ClientdashComponent;
  let fixture: ComponentFixture<ClientdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientdashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
