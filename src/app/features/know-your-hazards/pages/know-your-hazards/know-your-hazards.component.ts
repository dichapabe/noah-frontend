import { Component, OnInit } from '@angular/core';
import { KyhService } from '@features/know-your-hazards/services/kyh.service';
import { RiskLevel } from '@features/know-your-hazards/store/kyh.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'noah-know-your-hazards',
  templateUrl: './know-your-hazards.component.html',
  styleUrls: ['./know-your-hazards.component.scss'],
})
export class KnowYourHazardsComponent implements OnInit {
  searchTerm: string;
  currentLocation$: Observable<string>;
  riskLevel$: Observable<RiskLevel>;
  floodriskLevel$: Observable<RiskLevel>;
  stormsurgeriskLevel$: Observable<RiskLevel>;
  landslideriskLevel$: Observable<RiskLevel>;
  isFlood: boolean = false;
  islandSlide: boolean = false;
  isStorm: boolean = false;

  constructor(private kyhService: KyhService) {
    this.riskLevel$ = this.kyhService.riskLevel$;
    this.floodriskLevel$ = this.kyhService.floodriskLevel$;
    this.stormsurgeriskLevel$ = this.kyhService.stormsurgeriskLevel$;
    this.landslideriskLevel$ = this.kyhService.landslideriskLevel$;
  }

  ngOnInit(): void {
    this.kyhService.init();
    this.kyhService.setCurrentPage('know-your-hazards');
    this.currentLocation$ = this.kyhService.currentLocation$;
  }
  selectPlace(selectedPlace) {
    this.kyhService.setCurrentLocation(selectedPlace.text);
    const [lng, lat] = selectedPlace.center;
    this.kyhService.setCenter({ lat, lng });
    this.kyhService.setCurrentCoords({ lat, lng });
  }
}
