import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatSelectModule, MatInputModule,MatGridListModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule, MatButtonModule, MatSelectModule, MatInputModule,MatGridListModule
  ],
  exports: [
    MatButtonModule, MatSelectModule, MatInputModule,MatGridListModule
  ],
  declarations: []
})
export class AngularMaterialModule {}