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

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
          const db = (event!.target! as DBOpenEventTarget).result;
          // Create an objectStore for this database
          const objectStore = db.createObjectStore('dates', {
            autoIncrement: true,
            keyPath: 'id',
          });
          objectStore.createIndex('date_index', 'date', { unique: false });
        };
      });

      this.db.onerror = (event: Event) => {
        const target = event.target as DBOpenErrorEventTarget;
        console.error(`Database error: ${target?.error?.message}`);
      };
    }
  }

  async getItemsByDate(date: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log('getting events by date', date);

    return new Promise<Todo[]>((resolve, reject) => {
      const transaction = this.db.transaction('dates', 'readonly');
      const index = transaction.objectStore('dates').index('date_index');

      const request = index.getAll(date);

      request.onsuccess = (e: any) => {
        resolve(e.target.result);
      };
    });
  }

  createItem(item: Todo) {
    if (!isPlatformBrowser(this.platformId)) return;

    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.add(item);

    request.onsuccess = () => console.log('add successful');
  }

  updateItem(item: Todo) {
    if (!isPlatformBrowser(this.platformId)) return;

    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.put(item);

    request.onsuccess = () => console.log('update successful');
  }

  deleteItem(id: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.delete(id);
    request.onsuccess = () => console.log('delete successful');
  }

  toggleItemComplete(item: Todo) {
    const transaction = this.db.transaction('dates', 'readwrite');
    const objectStore = transaction.objectStore('dates');

    const request = objectStore.put({ ...item, completed: !item.completed });
    request.onsuccess = () => console.log('toggle successful');
  }
}
