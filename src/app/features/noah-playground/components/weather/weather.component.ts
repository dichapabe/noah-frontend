import { Component, Input, OnInit } from '@angular/core';
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
  @Input() type: WeatherSatelliteType;
  weatherSatellite: WeatherSatelliteType[] = ['himawari', 'himawari-GSMAP'];

  selectedWeatherSatellite$: Observable<WeatherSatelliteType>;
  expanded$: Observable<boolean>;
  shown$: Observable<boolean>;
  expanded = false;
  shown = false;

  initialOpacityValue: number = 30;

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
    const { shown, opacity } = this.pgService.getWeatherSatellite(this.type);
    this.initialOpacityValue = opacity;
    // const { expanded, shown } = this.pgService.getWeatherSatellites();
    // this.expanded = expanded;
    this.shown = shown;
  }

  // changeExaggerationLevel(opacity: number) {
  //   this.weatherSatellite = {
  //     ...this.weatherSatellite,
  //     opacity,
  //   };

  //   this.pgService.setWeatherSatellite(this.weatherSatellite);
  // }

  changeOpacity(opacity: number) {
    this.pgService.setWeatherSatelliteOpacity(opacity);
  }

  toggleExpanded() {
    this.pgService.toggleWeatherSatelliteGroupExpansion();
  }

  // toggleShown(event: Event) {
  //   event.stopPropagation();
  //   event.stopImmediatePropagation();

  //   this.pgService.toggleWeatherSatellitepGroupVisibility();
  // }

  toggleShown(event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.shown = !this.shown;
    this.pgService.setWeatherSatelliteProperty(this.shown, 'shown');
  }

  // toggleExpanded() {
  //   this.expanded = !this.expanded;
  //   this.pgService.setWeatherSatelliteProperty(this.expanded, 'expanded');
  // }

  // toggleShown() {
  //   this.shown = !this.shown;
  //   this.pgService.setWeatherSatelliteShown(this.shown, this.type)
  // }

  selectWeatherSatellite(type: WeatherSatelliteType) {
    this.pgService.selectWeatherSatelliteType(type);
  }
}
