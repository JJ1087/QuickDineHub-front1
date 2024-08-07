import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionPartesComponent } from './direccion-partes.component';

describe('DireccionPartesComponent', () => {
  let component: DireccionPartesComponent;
  let fixture: ComponentFixture<DireccionPartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DireccionPartesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DireccionPartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
