import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckInComponent } from './pages/check-in/check-in.component';
import { CheckOutComponent } from './pages/check-out/check-out.component';
import { RevisaoComponent } from './pages/revisao/revisao.component';

const routes: Routes = [
  {path:'', component: CheckInComponent },
  {path:'check-out/:id', component: CheckOutComponent },
  {path:'revisao/:id', component: RevisaoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
