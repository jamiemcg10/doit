import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

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
            keyPath: 'date',
          });
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

  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  //   if (isPlatformBrowser(platformId)) {
  //     const request = window.indexedDB.open(this.DB_NAME, 1);

  //     request.onerror = (e) => {
  //       console.error('An error occured when opening the database', e);
  //     };

  //     request.onsuccess = (e) => {
  //       console.log('Success opening database!');
  //       const target = e.target as DBOpenEventTarget;

  //       if (target?.result) {
  //         this.db = target.result;
  //         this.db.onerror = (event: Event) => {
  //           const target = event.target as DBOpenErrorEventTarget;
  //           console.error(`Database error: ${target?.error?.message}`);
  //         };
  //       }
  //     };
  //   }
  // }

  getEventsByDate(date: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log('getting events by date');
    console.log(this.db);

    const transaction = this.db.transaction('dates', 'readonly');
    console.log({ transaction });
    const objectStore = transaction.objectStore('dates');
    const t = objectStore.getAll();

    console.log({ t });
  }
}
