import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Todo } from '../types';
interface DBOpenEventTarget extends EventTarget {
  result: any;
}

interface DBOpenErrorEventTarget extends EventTarget {
  error: {
    message: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DBService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  DB_NAME = 'DoItList';
  db!: any; // might need to remove assertion later

  async init() {
    if (this.db) return;

    if (isPlatformBrowser(this.platformId)) {
      this.db = await new Promise<IDBDatabase | void>((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, 1);

        console.log({ request });

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error); // ? what is assigned?
        request.onupgradeneeded = (event) => {
          const db = (event!.target! as DBOpenEventTarget).result;
          // Create an objectStore for this database
          const objectStore = db.createObjectStore('dates', {
            // change later
            autoIncrement: true,
            keyPath: 'id',
          });
          objectStore.createIndex('date', 'id', { unique: false });
        };
      });

      this.db.onerror = (event: Event) => {
        const target = event.target as DBOpenErrorEventTarget;
        console.error(`Database error: ${target?.error?.message}`);
      };
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('DB not initialized yet');
    }
    return this.db;
  }

  async getItemsByDate(date: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log('getting events by date', date);

    return new Promise<Todo[]>((resolve, reject) => {
      const transaction = this.db.transaction('dates', 'readonly');
      console.log({ transaction });
      const objectStore = transaction.objectStore('dates');
      const t = objectStore.getAll();

      t.onsuccess = (e: any) => {
        console.log({ e });
        resolve(e.target.result);
      };
    });
  }

  addItem() {
    if (!isPlatformBrowser(this.platformId)) return;

    const transaction = this.db.transaction('dates', 'readwrite');
    console.log({ transaction });
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.add({ date: '2026-03-28', name: 'Test 1', completed: false });

    request.onsuccess = () => console.log('yay');
  }

  deleteItem(id: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.delete(id);
    request.onsuccess = () => console.log('gone');
  }

  toggleItemComplete(item: Todo) {
    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.put({ ...item, completed: !item.completed });
    request.onsuccess = () => console.log('toggled');
  }
}
