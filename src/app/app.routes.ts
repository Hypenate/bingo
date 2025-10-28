import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BingoComponent } from './bingo/bingo.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        redirectTo: 'bingo',
        pathMatch: 'full',
      },
      {
        path: 'bingo',
        component: BingoComponent,
      },
    ],
  },
];
