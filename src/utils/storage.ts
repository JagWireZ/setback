import { Storage, Drivers } from '@ionic/storage';

export const storage = new Storage({
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});
