import { Component } from '@angular/core';
import {LocationService} from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {
  protected isValidLocation: boolean = true;
  constructor(private service: LocationService) { }

  /**
   * Adds location that user enters.
   * @param zipcode Map location zip code.
   */
  addLocation(zipcode: string): void {
    if (this.service.isValidLocation(zipcode)) {
      this.isValidLocation = true;
      this.service.addLocation(zipcode);
    } else {
      this.isValidLocation = false;
    }
  }

}
