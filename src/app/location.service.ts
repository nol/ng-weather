import { Injectable, Signal, inject, signal } from '@angular/core';
import { StoreService } from './store.service';
import { LoggerService } from './logger.service';

const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private logger = inject(LoggerService);
  private storeService = inject(StoreService);
  private currentLocations = signal<string[]>([]);
  private locationAdded = signal<string | null>(null);
  private locationRemoved = signal<string | null>(null);
  private locations: string[] = [];

  constructor() {
    // Loads locations from store.
    this.locations = this.storeService.retrieve<string[]>(LOCATIONS) || [];
    if (this.locations.length) {
      this.logger.info('Loading locations from store', this.locations);
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
   * Validates the zip code format.
   * @param zipcode 
   * @returns If the zip code is valid or not.
   */
  isValidLocation(zipcode: string): boolean {
    // Now just for us format, but it could be expandend to use environment configuration and use the country code.
    const usCode = /^\d{5}(-\d{4})?$/;
    this.logger.info('Validating zipcode', zipcode, usCode.test(zipcode));
    return usCode.test(zipcode);
  }

  /**
   * Adds location to the list of locations and notify listeners.
   * @param zipcode Map location zip code.
   */
  addLocation(zipcode : string): void {
    if (!this.locations.includes(zipcode)) {
      this.logger.info('Adding new location', zipcode);
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
    if (index !== -1) {
      this.logger.info('Removing location', zipcode);
      this.locations.splice(index, 1);
      this.locationRemoved.set(zipcode);
      this.locationAdded.set(null); // Reset last location added
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
