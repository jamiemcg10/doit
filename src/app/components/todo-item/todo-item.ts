import { Component, input, inject, output, linkedSignal } from '@angular/core';
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
  dbService = inject(DBService);

  item = input.required<Todo>();
  newItem = input(false);

  cancelNew = output();

  newName = '';

  editing = linkedSignal(() => this.newItem());

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
  }

  cancelEdit() {
    this.editing.set(false);

    if (!this.item().id) {
      // remove if new
      this.cancelNew.emit();
    }
  }

  // TODO: make sure this actually works on device
  toggleComplete() {
    console.log('toggling complete');
    this.dbService.toggleItemComplete(this.item());
  }

  moveToNextDay() {
    this.dbService.updateItem({ ...this.item(), date: getNextDateString(this.item().date) });
  }
  moveToPreviousDay() {
    this.dbService.updateItem({ ...this.item(), date: getPrevDateString(this.item().date) });
  }

  deleteItem(event: PointerEvent) {
    const id = this.item().id;
    if (id === undefined) return;

    console.log('deleting item', this.item().name, this.item().id);
    event.preventDefault(); // hopefully stops double click event from being fired
    this.dbService.deleteItem(id);
  }
}
