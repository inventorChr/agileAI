import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ElementDataModule { }

export interface ElementData {
  id: string;
  placeholder: string;
  url: string;
  key: string;

}
