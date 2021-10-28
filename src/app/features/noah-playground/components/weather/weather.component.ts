import { Component, OnInit } from '@angular/core';
import { NoahPlaygroundService } from '@features/noah-playground/services/noah-playground.service';
import {
  WeatherSatelliteType,
  WeatherSatelliteState,
} from '@features/noah-playground/store/noah-playground.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'noah-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  weatherSatellite: WeatherSatelliteType[] = ['himawari', 'himawari-GSMAP'];

  expanded$: Observable<boolean>;
  selectedWeatherSatellite$: Observable<WeatherSatelliteType>;
  shown$: Observable<boolean>;

  // get opacity(): number {
  //   return this.weatherSatellite.opacity;
  // }

  constructor(private pgService: NoahPlaygroundService) {}

  ngOnInit(): void {
    // The only time we get the value from the state directly is when we're
    // initializing the value
    this.expanded$ = this.pgService.weatherSatelliteGroupExpanded$;
    this.selectedWeatherSatellite$ = this.pgService.selectedWeatherSatellite$;
    this.shown$ = this.pgService.weatherSatelliteGroupShown$;
  }

  // changeExaggerationLevel(opacity: number) {
  //   this.weatherSatellite = {
  //     ...this.weatherSatellite,
  //     opacity,
  //   };

  //   this.pgService.setWeatherSatellite(this.weatherSatellite);
  // }

  toggleExpanded() {
    this.pgService.toggleWeatherSatelliteGroupExpansion();
  }

  toggleShown(event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.pgService.toggleWeatherSatellitepGroupVisibility();
  }

  selectWeatherSatellite(weatherSatelliteType: WeatherSatelliteType) {
    this.pgService.selectWeatherSatelliteType(weatherSatelliteType);
  }
}
