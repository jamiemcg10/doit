import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';
import { TodoItem } from '../components/todo-item/todo-item';
import { IconButton } from '../components/icon-button/icon-button';
@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
  imports: [TodoItem, IconButton],
})
export class ListPage {
  addItem() {
    console.log('adding item');
    this.dbService.addItem();
  }

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  dbService = inject(DBService);
  date = computed(() => (this.data() ? this.data()!['date'] : '12'));

  dbResource = resource({
    params: () => ({ date: this.date() }),
    loader: (params) => this.dbService.getItemsByDate(params.params.date),
  });

  isLoading = computed(() => this.dbResource.status() === 'loading');
  isError = computed(() => this.dbResource.status() === 'error');
}
