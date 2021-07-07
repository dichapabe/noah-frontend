import { Injectable } from '@angular/core';
import { StoreService } from '@core/services/store-service.service';

export const PH_DEFAULT_CENTER = {
  lat: 10.777080241395213,
  lng: 124.98707397619495,
};

export type KYHPage = 'know-your-hazards' | 'critical-facilities' | HazardType;

export type HazardType = 'flood' | 'landslide' | 'storm-surge';

export type RiskLevel = 'unavailable' | 'little' | 'low' | 'medium' | 'high';

export type FloodRiskLevel =
  | 'unavailable'
  | 'little'
  | 'low'
  | 'medium'
  | 'high';
export type StormSurgeRiskLevel =
  | 'unavailable'
  | 'little'
  | 'low'
  | 'medium'
  | 'high';
export type LandslideRiskLevel =
  | 'unavailable'
  | 'little'
  | 'low'
  | 'medium'
  | 'high';

type KYHState = {
  isLoading: boolean;
  center: { lng: number; lat: number };
  currentCoords: { lng: number; lat: number };
  currentPage: KYHPage;
  riskLevel: RiskLevel;
  floodriskLevel: FloodRiskLevel;
  stormsurgeriskLevel: StormSurgeRiskLevel;
  landslideriskLevel: LandslideRiskLevel;
  currentLocation: string;
};

const createInitialValue = (): KYHState => {
  return {
    isLoading: false,
    center: PH_DEFAULT_CENTER,
    currentCoords: PH_DEFAULT_CENTER,
    currentPage: 'know-your-hazards',
    riskLevel: 'unavailable',
    floodriskLevel: 'unavailable',
    stormsurgeriskLevel: 'unavailable',
    landslideriskLevel: 'unavailable',
    currentLocation: '------',
  };
};

@Injectable({
  providedIn: 'root',
})
export class KyhStore extends StoreService<KYHState> {
  store = 'kyh-store';

  constructor() {
    super(createInitialValue());
  }
}
