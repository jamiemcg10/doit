import {
  Component,
  input,
  inject,
  output,
  linkedSignal,
  afterEveryRender,
  ElementRef,
} from '@angular/core';
import { IconButton } from '../icon-button/icon-button';
import { DBService } from '../../services/DBService';
import { Todo } from '../../types';
import { FormsModule } from '@angular/forms';
import { getNextDateString, getPrevDateString } from '../../utils/getDateStrings';
@Component({
  templateUrl: './todo-item.html',
  selector: 'todo-item',
  imports: [IconButton, FormsModule],
})
export class TodoItem {
  constructor() {
    const nameInputEl = inject(ElementRef);

    afterEveryRender(() => {
      nameInputEl.nativeElement.querySelector('input[type=text]')?.focus();
    });
  }

  dbService = inject(DBService);

  item = input.required<Todo>();
  newItem = input(false);

  cancelNew = output();
  triggerUpdate = output();

  newName = '';

  editing = linkedSignal(() => this.newItem());

  handleKeypress(e: any) {
    if (e.key === 'Enter' && this.newName) {
      this.saveName();
    }
  }
  setEditing() {
    this.newName = this.item().name;
    this.editing.set(true);
  }

  saveName() {
    if (this.item().id) {
      this.dbService.updateItem({ ...this.item(), name: this.newName });
      this.item().name = this.newName;
    } else {
      // will create new item and will need to refresh
      this.dbService.createItem({ ...this.item(), name: this.newName });
      this.cancelNew.emit();
    }

    this.editing.set(false);
    this.triggerUpdate.emit();
  }

  cancelEdit() {
    this.editing.set(false);

    if (!this.item().id) {
      // remove if new
      this.cancelNew.emit();
    }
  }

  toggleComplete() {
    this.dbService.toggleItemComplete(this.item());
    this.triggerUpdate.emit();
  }

  moveToNextDay() {
    this.dbService.updateItem({ ...this.item(), date: getNextDateString(this.item().date) });
    this.triggerUpdate.emit();
  }

  moveToPreviousDay() {
    this.dbService.updateItem({ ...this.item(), date: getPrevDateString(this.item().date) });
    this.triggerUpdate.emit();
  }

  deleteItem() {
    const id = this.item().id;
    if (id === undefined) return;

    this.dbService.deleteItem(id);
    this.triggerUpdate.emit();
  }
}
