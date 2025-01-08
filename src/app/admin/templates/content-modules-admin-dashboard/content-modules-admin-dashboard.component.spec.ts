import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContentModulesAdminDashboardComponent } from './content-modules-admin-dashboard.component';

describe('ContentModulesAdminDashboardComponent', () => {
  let component: ContentModulesAdminDashboardComponent;
  let fixture: ComponentFixture<ContentModulesAdminDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentModulesAdminDashboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentModulesAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
