import { Injectable } from "@angular/core";

import { environment } from "environments/environment";

const TIMESTAMP_KEY: string = "timestamp";
const DATA_KEY: string = "data";
const WITHOUT_EXPIRATION_VALUE: number = 0;

@Injectable()
export class StoreService {

  /**
   * Stores the data with the timestamp of the moment of call
   * @param key Local Storage key to be stored
   * @param data Object to be stored
   * @param withoutExpiration Option to disable expiration of stored data
   */
  store<T>(key: string, data: T, withoutExpiration: boolean = false): void {
    const newData = { [DATA_KEY]: data, [TIMESTAMP_KEY]: withoutExpiration? WITHOUT_EXPIRATION_VALUE : Date.now() };
    localStorage.setItem(key, JSON.stringify(newData));
  }

  /**
   * Retrieves the stored object
   * @param key Local Storage key to be retrieved
   * @returns The stored data object or null if is not found or expired
   */
  retrieve<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item);
      if (parsedItem[TIMESTAMP_KEY] == WITHOUT_EXPIRATION_VALUE || 
        (parsedItem[TIMESTAMP_KEY] && (parsedItem[TIMESTAMP_KEY] + environment.storeExpirationInMilliseconds) >= Date.now())) {
        return parsedItem[DATA_KEY] as T;
      }
    }
    return null;
  }
}