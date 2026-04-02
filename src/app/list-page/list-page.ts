import { Component, computed, inject, linkedSignal, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DBService } from '../services/DBService';
import { TodoItem } from '../components/todo-item/todo-item';
import { IconButton } from '../components/icon-button/icon-button';
import { Router } from '@angular/router';
import { getNextDateString, getPrevDateString } from '../utils/getDateStrings';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.html',
  providers: [provideNativeDateAdapter()],
  imports: [TodoItem, IconButton, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
})
export class ListPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);

  dbService = inject(DBService);
  date = computed(() => this.data()!['date']);

  calendarDate = new FormControl(this.date());

  dbResource = resource({
    params: () => ({ date: this.date() }),
    loader: (params) => this.dbService.getItemsByDate(params.params.date),
  });

  isLoading = computed(() => this.dbResource.status() === 'loading');
  isError = computed(() => this.dbResource.status() === 'error');

  today = new Date().toLocaleDateString('en-CA');
  dateString = computed(() =>
    new Date(`${this.date()}T00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      ...(new Date(`${this.date()}T00:00`).getFullYear() !== new Date().getFullYear() && {
        year: 'numeric',
      }),
    }),
  );
  items = linkedSignal(() => this.dbResource.value());

  adding = false;

  handleDateChange() {
    this.router.navigate([`/date/${this.calendarDate.value.toLocaleDateString('en-CA')}`]);
  }

  reload() {
    this.dbResource.reload();
  }

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
}
