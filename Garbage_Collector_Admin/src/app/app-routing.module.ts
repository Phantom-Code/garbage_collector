import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'pie-chart',
    loadChildren: () =>
      import('./pie-chart/pie-chart.module').then((m) => m.PieChartPageModule),
  },
  {
    path: 'bar-chart',
    loadChildren: () => import('./bar-chart/bar-chart.module').then( m => m.BarChartPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
