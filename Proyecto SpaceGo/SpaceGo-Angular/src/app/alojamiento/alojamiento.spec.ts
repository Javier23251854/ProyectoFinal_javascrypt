import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alojamiento } from './alojamiento';

describe('Alojamiento', () => {
  let component: Alojamiento;
  let fixture: ComponentFixture<Alojamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alojamiento],
    }).compileComponents();

    fixture = TestBed.createComponent(Alojamiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
