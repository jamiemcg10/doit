import { Routes } from '@angular/router';
import { ListPage } from './list-page/list-page';
import { CalendarPage } from './calendar-page/calendar-page';
import { NotFound } from './not-found/not-found';
import { dateResolver } from './resolvers/dateResolver';

export const routes: Routes = [
  { path: '', component: ListPage, resolve: { date: dateResolver }, data: { class: 'flex' } },
  { path: 'calendar', component: CalendarPage },
  { path: 'date/:date', component: ListPage, resolve: { date: dateResolver } },
  { path: '**', component: NotFound },
];
