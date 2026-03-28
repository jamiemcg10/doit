import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
})
export class ListPage {
  // todoItems: any[];

  // constructor() {
  //   console.log(this.date());
  //   this.todoItems = this.dbService.getEventsByDate(this.date());
  // }

  addItem() {
    console.log('adding item');
    this.dbService.addItem();
  }

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  dbService = inject(DBService);
  date = computed(() => (this.data() ? this.data()!['date'] : ''));

  dbResource = resource({
    params: () => ({ date: this.date() }),
    loader: (params) => this.dbService.getEventsByDate(params.params.date),
  });

  isLoading = computed(() => this.dbResource.status() === 'loading');
  isError = computed(() => this.dbResource.status() === 'error');

  todoItems = this.dbService.getEventsByDate(this.date());
}
