import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonModal } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PermisosComponent } from './permisos/permisos.component';
import { CompaniesComponent } from './companies/companies.component';
// import { CountriesComponent } from './countries/countries.component';
import { RolesComponent } from './roles/roles.component';
import { UsersAdminsComponent } from './users-admins/users-admins.component';
import { CountriesComponent } from './countries/countries.component';
import { DeleteSessionUserComponent } from './delete-session-user/delete-session-user.component';
import { PermisosRolesComponent } from './permisos-roles/permisos-roles.component';
import { UsersRolesComponent } from './users-roles/users-roles.component';
import * as jQuery from 'jquery';
import { BotonVerdeComponent } from './templates/boton-verde/boton-verde.component';
import { ContentModulesAdminDashboardComponent } from './templates/content-modules-admin-dashboard/content-modules-admin-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AdminPage,
    DashboardComponent,
    CompaniesComponent,
    CountriesComponent,
    PermisosComponent,
    RolesComponent,
    UsersAdminsComponent,
    DeleteSessionUserComponent,
    PermisosRolesComponent,
    UsersRolesComponent,
    BotonVerdeComponent,
    ContentModulesAdminDashboardComponent
  ],
  exports:[
    IonicModule,
    IonModal,
    BotonVerdeComponent,
    ContentModulesAdminDashboardComponent
  ]
})
export class AdminPageModule {}
