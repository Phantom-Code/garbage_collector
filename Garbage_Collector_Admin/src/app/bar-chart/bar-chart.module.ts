import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarChartPageRoutingModule } from './bar-chart-routing.module';

import { BarChartPage } from './bar-chart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarChartPageRoutingModule
  ],
  declarations: [BarChartPage]
})
export class BarChartPageModule {}
