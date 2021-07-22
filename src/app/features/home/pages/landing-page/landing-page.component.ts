import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KyhService } from '@features/know-your-hazards/services/kyh.service';
@Component({
  selector: 'noah-landing-page',
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  searchTerm: string;
  isDropdownOpen = false;

  constructor(private kyhService: KyhService) {}

  ngOnInit(): void {}

  selectPlace(selectedPlace) {
    this.kyhService.setCurrentLocation(selectedPlace.text);
    const [lng, lat] = selectedPlace.center;
    this.kyhService.setCenter({ lat, lng });
    this.kyhService.setCurrentCoords({ lat, lng });
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
