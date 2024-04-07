import {Component, effect, inject, Signal, untracked} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  protected currentLocations: Signal<string[]> = this.locationService.getCurrentLocations();
  protected locationAdded: Signal<string> = this.locationService.getLocationAdded();
  protected locationRemoved: Signal<string> = this.locationService.getLocationRemoved();
  protected currentConditionsNotFound: Signal<string> = this.weatherService.getCurrentConditionNotFound();

  constructor() {
    // Loads the weather current conditions by stored locations on start, just once.
    effect(() => untracked(() => this.currentLocations().forEach((location: string) => this.weatherService.addCurrentConditions(location))), { allowSignalWrites: true });
    
    // Adds the weather current condition on location add.
    effect(() => { if (this.locationAdded() != null) this.weatherService.addCurrentConditions(this.locationAdded()) }, { allowSignalWrites: true });
    
    // Removes the weather current condition on location remove.
    effect(() => { if (this.locationRemoved() != null) this.weatherService.removeCurrentConditions(this.locationRemoved())}, { allowSignalWrites: true });

    // Removes the location when not found.
    effect(() => { if (this.currentConditionsNotFound() != null) this.locationService.removeLocation(this.currentConditionsNotFound())}, { allowSignalWrites: true });
  }

  /**
   * Shows the forecast details by zipcode.
   * @param zipcode Map location zipcode.
   */
  showForecast(zipcode : string) {
    this.router.navigate(['/forecast', zipcode])
  }
}
