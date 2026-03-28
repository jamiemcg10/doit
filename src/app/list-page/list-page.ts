import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
})
export class ListPage {
  constructor() {
    console.log(this.date());
    this.dbService.getEventsByDate(this.date());
  }

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  dbService = inject(DBService);

  date = computed(() => (this.data() ? this.data()!['date'] : ''));
}
