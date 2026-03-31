import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';
import { TodoItem } from '../components/todo-item/todo-item';
import { IconButton } from '../components/icon-button/icon-button';
import { Router } from '@angular/router';
@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
  imports: [TodoItem, IconButton],
})
export class ListPage {
  private router = inject(Router);
  private DAY = 24 * 60 * 60 * 1000; // move to consts file if there are any others
  today = new Date().toLocaleDateString('en-CA');

  addItem() {
    console.log('adding item');
    this.dbService.addItem();
  }

  handleScrollBackward() {
    console.log('handleScrollBackward');
    console.log(this.data(), this.date());

    // get previous date
    const currentDate = new Date(`${this.date()}T00:00`);
    const prevDateValue = currentDate.valueOf() - this.DAY;

    const prevDate = new Date(prevDateValue);

    // route
    this.router.navigate([`/date/${prevDate.toLocaleDateString('en-CA')}`]);
  }

  handleScrollForward() {
    console.log('handleScrollForward');
    console.log(this.data(), this.date());
    // get next date

    const currentDate = new Date(`${this.date()}T00:00`);
    const nextDateValue = currentDate.valueOf() + this.DAY;

    const nextDate = new Date(nextDateValue);

    // route
    this.router.navigate([`/date/${nextDate.toLocaleDateString('en-CA')}`]);
  }

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  dbService = inject(DBService);
  date = computed(() => this.data()!['date']);

  dbResource = resource({
    params: () => ({ date: this.date() }),
    loader: (params) => this.dbService.getItemsByDate(params.params.date),
  });

  isLoading = computed(() => this.dbResource.status() === 'loading');
  isError = computed(() => this.dbResource.status() === 'error');
}
