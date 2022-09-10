import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaDetailComponent } from './cuenta-detail/cuenta-detail.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CuentaDetailComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule
  ],
  exports: [CuentaDetailComponent]
})
export class CuentaModule { }
