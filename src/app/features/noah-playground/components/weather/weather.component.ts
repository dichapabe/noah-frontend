import { Component, Input, OnInit } from '@angular/core';
import { NoahPlaygroundService } from '@features/noah-playground/services/noah-playground.service';
import { WeatherSatelliteType } from '@features/noah-playground/store/noah-playground.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'noah-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  @Input() name: WeatherSatelliteType;

  selectedWeatherSatellite$: Observable<WeatherSatelliteType>;
  shown = false;

  initialOpacityValue: number = 20;

  get displayName(): string {
    return this.name.replace('-', ' ');
  }

  constructor(private pgService: NoahPlaygroundService) {}

  ngOnInit(): void {
    // The only time we get the value from the state directly is when we're
    // initializing the value
    this.selectedWeatherSatellite$ = this.pgService.selectedWeatherSatellite$;
    const { shown, opacity } = this.pgService.getWeatherSatellite(this.name);
    this.shown = shown;
    this.initialOpacityValue = opacity;
  }

  changeOpacity(opacity: number) {
    this.pgService.setWeatherSatelliteOpacity(opacity, this.name);
  }

  selectWeatherSatellite(type: WeatherSatelliteType) {
    this.pgService.selectWeatherSatelliteType(type);
  }
}
