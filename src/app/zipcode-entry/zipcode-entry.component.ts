import { Component } from '@angular/core';
import {LocationService} from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService) { }

  /**
   * Adds location that user enters.
   * @param zipcode Map location zipcode
   */
  addLocation(zipcode: string){
    this.service.addLocation(zipcode);
  }

}
