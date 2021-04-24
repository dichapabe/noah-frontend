import { Injectable } from '@angular/core';
import { StoreService } from '@core/services/store-service.service';
import { LngLatLike } from 'mapbox-gl';

const PH_DEFAULT_CENTER = { lat: 12.8797, lng: 121.774 };

type PRAPage = 'base' | 'critical-facitilies' | HazardType;

type HazardType = 'flood' | 'landslide' | 'storm-surge';

type RiskLevel = 'unavailable' | 'little' | 'low' | 'medium' | 'high';

type PRAState = {
  isLoading: boolean;
  center: LngLatLike;
  currentPage: PRAPage;
  riskLevel: RiskLevel;
};

const createInitialValue = (): PRAState => {
  return {
    isLoading: false,
    center: PH_DEFAULT_CENTER,
    currentPage: 'base',
    riskLevel: 'unavailable',
  };
};

@Injectable({
  providedIn: 'root',
})
export class PraStore extends StoreService<PRAState> {
  store = 'pra-store';

  constructor() {
    super(createInitialValue());
  }
}
