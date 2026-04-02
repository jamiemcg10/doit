import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';
import { TodoItem } from '../components/todo-item/todo-item';
import { IconButton } from '../components/icon-button/icon-button';
import { Router } from '@angular/router';
import { getNextDateString, getPrevDateString } from '../utils/getDateStrings';
@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
  imports: [TodoItem, IconButton],
})
export class ListPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);

  dbService = inject(DBService);
  date = computed(() => this.data()!['date']);

  dbResource = resource({
    params: () => ({ date: this.date() }),
    loader: (params) => this.dbService.getItemsByDate(params.params.date),
  });

  today = new Date().toLocaleDateString('en-CA');
  items = computed(() => this.dbResource.value());

  adding = false;

  addItem() {
    this.adding = true;
  }

  removeNew() {
    this.adding = false;
  }

  handleScrollBackward() {
    this.adding = false;

    const prevDate = getPrevDateString(this.date());

    this.router.navigate([`/date/${prevDate}`]);
  }

  handleScrollForward() {
    this.adding = false;
    const nextDate = getNextDateString(this.date());

    this.router.navigate([`/date/${nextDate}`]);
  }

  isLoading = computed(() => this.dbResource.status() === 'loading');
  isError = computed(() => this.dbResource.status() === 'error');
}
