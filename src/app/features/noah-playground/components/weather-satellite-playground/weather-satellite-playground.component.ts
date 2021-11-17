import { Component, OnInit } from '@angular/core';
import { NoahPlaygroundService } from '@features/noah-playground/services/noah-playground.service';
import { WeatherSatelliteType } from '@features/noah-playground/store/noah-playground.store';

@Component({
  selector: 'noah-weather-satellite-playground',
  templateUrl: './weather-satellite-playground.component.html',
  styleUrls: ['./weather-satellite-playground.component.scss'],
})
export class WeatherSatellitePlaygroundComponent implements OnInit {
  isOpenedList;
  weatherSatellite: WeatherSatelliteType[] = ['himawari', 'himawari-GSMAP'];

  expanded = true;
  shown = true;

  constructor(private pgService: NoahPlaygroundService) {}

  ngOnInit(): void {
    const { expanded, shown } = this.pgService.getWeatherSatellites();
    this.expanded = expanded;
    this.shown = shown;
  }

  toggleShown(event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.shown = !this.shown;
    this.pgService.setWeatherSatelliteProperty(this.shown, 'shown');
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.pgService.setWeatherSatelliteProperty(this.expanded, 'expanded');
  }
}
