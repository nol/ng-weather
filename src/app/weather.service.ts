import {Injectable, Signal, inject, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

import {HttpClient, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import mockCurrentConditions from '../assets/weather.json';
import mockForecast from '../assets/forecast.json';
import { StoreService } from './store.service';
import { LoggerService } from './logger.service';

const FORECAST_PREFIX: string = "forecast_";
const CONDITION_PREFIX: string = "condition_";

@Injectable()
export class WeatherService {
  private logger = inject(LoggerService);
  private storeService = inject(StoreService);
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private currentConditionNotFound = signal<string | null>(null);
  private currentZips: string[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Add weather current conditions by zip code.
   * @param zipcode Map location zip code.
   */
  addCurrentConditions(zipcode: string): void {
    if (!this.currentZips.includes(zipcode)) {
      this.logger.info('Adding current conditions', zipcode);
      const condition = this.storeService.retrieve<CurrentConditions>(CONDITION_PREFIX + zipcode);
      if(condition != null) {
        this.logger.info('Loading current conditions from store', zipcode);
        this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data: condition}]);
        this.currentZips.push(zipcode);
      } else {
        this.getCurrentConditionsSource(zipcode).subscribe(
          (data) => {
            this.logger.info('Storing current conditions to store', zipcode);
            this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data}]);
            this.storeService.store<CurrentConditions>(CONDITION_PREFIX + zipcode, data);
            this.currentZips.push(zipcode);
          },
          (error: HttpErrorResponse) => {
            //When condition not found, notify.
            if (error.status == HttpStatusCode.NotFound) {
              this.currentConditionNotFound.set(zipcode);
            }
            this.logger.error(error.message);
          }
        );
      }
    }
  }

  /**
   * Removes weather current conditions by zip code.
   * @param zipcode Map location zip code.
   */
  removeCurrentConditions(zipcode: string) {
    if (this.currentZips.includes(zipcode)) {
      this.logger.info('Removing current conditions', zipcode);
      this.currentConditions.update(conditions => {
        for (let i in conditions) {
          if (conditions[i].zip == zipcode)
            conditions.splice(+i, 1);
        }
        return conditions;
      });
      let index = this.currentZips.indexOf(zipcode);
      this.currentZips.splice(index, 1);
    }
  }

  /**
   * 
   * @returns Signal of weather conditions list.
   */
  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  /**
   * 
   * @returns Signal of invalid zip code.
   */
  getCurrentConditionNotFound(): Signal<string> {
    return this.currentConditionNotFound.asReadonly();
  }

  /**
   * 
   * @param zipcode Map location zipcode.
   * @returns Forecast detail.
   */
  getForecast(zipcode: string): Observable<Forecast> {
    const forecast = this.storeService.retrieve<Forecast>(FORECAST_PREFIX + zipcode);
    if(forecast != null) {
      this.logger.info('Loading forecast from store', zipcode);
      return of(forecast);
    } else {
      this.logger.info('Storing forecast to store', zipcode);
      return this.getForecastSource(zipcode).pipe<Forecast>(
        tap<Forecast>((forecast: Forecast) => this.storeService.store<Forecast>(FORECAST_PREFIX + zipcode, forecast))
      );
    }
  }

  /**
   * 
   * @param id Weather conditions id
   * @returns Image that represents the weather conditions
   */
  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return environment.weatherIconUri + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return environment.weatherIconUri + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return environment.weatherIconUri + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return environment.weatherIconUri + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return environment.weatherIconUri + "art_clouds.png";
    else if (id === 741 || id === 761)
      return environment.weatherIconUri + "art_fog.png";
    else
      return environment.weatherIconUri + "art_clear.png";
  }

  private getCurrentConditionsSource(zipcode: string): Observable<CurrentConditions> {
    this.logger.debug('userMock', environment.useMock);
    if (environment.useMock) {
      return of(mockCurrentConditions as CurrentConditions);
    } else {
      // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
      return this.http.get<CurrentConditions>(`${environment.weatherAPI}/weather?zip=${zipcode},${environment.weatherCountryCode}&units=${environment.weatherUnit}&APPID=${environment.weatherAPIKEY}`);
    }
  }

  private getForecastSource(zipcode: string): Observable<Forecast> {
    this.logger.debug('userMock', environment.useMock);
    if (environment.useMock) {
      return of(mockForecast as Forecast);
    } else {
      // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
      return this.http.get<Forecast>(`${environment.weatherAPI}/forecast/daily?zip=${zipcode},${environment.weatherCountryCode}&units=${environment.weatherUnit}&cnt=${environment.weatherForcastDays}&APPID=${environment.weatherAPIKEY}`);
    }
  }

}
