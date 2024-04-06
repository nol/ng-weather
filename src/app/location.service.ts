import { Injectable, Signal, inject, signal } from '@angular/core';
import { StoreService } from './store.service';
import { LoggerService } from './logger.service';

const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private loggerService = inject(LoggerService);
  private storeService = inject(StoreService);
  private currentLocations = signal<string[]>([]);
  private locationAdded = signal<string>('');
  private locationRemoved = signal<string>('');
  private locations: string[] = [];

  constructor() {
    // Loads locations from store.
    this.locations = this.storeService.retrieve<string[]>(LOCATIONS) || [];
    if (this.locations.length) {
      this.loggerService.debug('Init locations', this.locations);
      // Sets locations to notify listeners.
      this.currentLocations.set(this.locations);
    }
  }

  /**
   * 
   * @returns Signal of current zip codes in use.
   */
  getCurrentLocations(): Signal<string[]> {
    return this.currentLocations.asReadonly();
  }

  /**
   * 
   * @returns Signal of last zip code added.
   */
  getLocationAdded(): Signal<string> {
    return this.locationAdded.asReadonly();
  }

  /**
   * 
   * @returns Signal of last zip code removed.
   */
  getLocationRemoved(): Signal<string> {
    return this.locationRemoved.asReadonly();
  }

  /**
   * Adds location to the list of locations and notify listeners.
   * @param zipcode Map location zip code.
   */
  addLocation(zipcode : string): void {
    if (!this.locations.includes(zipcode)) {
      this.loggerService.debug('Adding new zip', zipcode);
      this.locations.push(zipcode);
      this.locationAdded.set(zipcode);
      this.currentLocations.update(locations => [...locations]);
      this.storeService.store<string[]>(LOCATIONS, this.locations, true);
    }
  }

  /**
   * Removes location from the list of locations and notify listeners.
   * @param zipcode Map location zip code.
   */
  removeLocation(zipcode: string): void {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      this.locationRemoved.set(zipcode);
      this.currentLocations.update(locations => {
        for (let i in locations) {
          if (locations[i] == zipcode)
            locations.splice(+i, 1);
        }
        return locations;
      });
      this.storeService.store<string[]>(LOCATIONS, this.locations, true);
    }
  }

  /**
   * Removes invalid location and notify listeners.
   * @param zipcode Map location zip code.
   */
  invalidLocation(zipcode: string): void {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      this.currentLocations.update(locations => {
        for (let i in locations) {
          if (locations[i] == zipcode)
            locations.splice(+i, 1);
        }
        return locations;
      });
      this.storeService.store<string[]>(LOCATIONS, this.locations, true);
    }
  }
}
