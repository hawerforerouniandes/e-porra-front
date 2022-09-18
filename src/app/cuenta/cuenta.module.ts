import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentaCreateComponent } from './cuenta-create/cuenta-create.component';
import { CuentaDeleteComponent } from './cuenta-delete/cuenta-delete.component';

@NgModule({
  declarations: [CuentaDetailComponent, CuentaCreateComponent, CuentaDeleteComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule
  ],
  exports: [CuentaDetailComponent, CuentaCreateComponent]
})
export class CuentaModule { }
