import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarChartPage } from './bar-chart.page';

const routes: Routes = [
  {
    path: '',
    component: BarChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarChartPageRoutingModule {}
