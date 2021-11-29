import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth/auth.module').then((mod) => mod.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./routes/home/home.module').then((mod) => mod.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'list/:id',
    loadChildren: () =>
      import('./routes/list/list.module').then((mod) => mod.ListModule),
    canActivate: [AuthGuard],
  },
  {
    path: '404',
    loadChildren: () =>
      import('./routes/not-found/not-found.module').then(
        (mod) => mod.NotFoundModule
      ),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
