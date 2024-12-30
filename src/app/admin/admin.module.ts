import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonModal } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermisosComponent } from './permisos/permisos.component';
import { CompaniesComponent } from './companies/companies.component';
// import { CountriesComponent } from './countries/countries.component';
import { RolesComponent } from './roles/roles.component';
import { UsersAdminsComponent } from './users-admins/users-admins.component';
import * as jQuery from 'jquery';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
  ],
  declarations: [
    AdminPage,
    DashboardComponent,
    CompaniesComponent,
    //CountriesComponent,
    PermisosComponent,
    RolesComponent,
    UsersAdminsComponent
  ],
  exports:[
    IonicModule,
    IonModal
  ]
})
export class AdminPageModule {}
