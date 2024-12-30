import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalculadoraEnganchesComponent } from './calculadora-enganches.component';

describe('CalculadoraEnganchesComponent', () => {
  let component: CalculadoraEnganchesComponent;
  let fixture: ComponentFixture<CalculadoraEnganchesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculadoraEnganchesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculadoraEnganchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
