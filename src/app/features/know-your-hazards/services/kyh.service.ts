import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { HazardType, KyhStore, KYHPage, RiskLevel } from '../store/kyh.store';
import { HazardsService } from './hazards.service';

@Injectable({
  providedIn: 'root',
})
export class KyhService {
  criticalFacilities$: Observable<FeatureCollection>;

  constructor(
    private gaService: GoogleAnalyticsService,
    private kyhStore: KyhStore,
    private hazardsService: HazardsService
  ) {}

  keyBoard: Subject<any> = new Subject<any>();
  sendMessage(message: any) {
    this.keyBoard.next(message);
  }

  get center$(): Observable<{ lng: number; lat: number }> {
    return this.kyhStore.state$.pipe(
      map((state) => state.center),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      shareReplay(1)
    );
  }

  getCriticalFacilities$(): Observable<FeatureCollection> {
    return this.center$.pipe(
      tap((c) => console.log({ c })),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      debounceTime(300),
      tap((d) => console.log({ d })),
      switchMap((coords) => {
        console.log('switchMap getCriticalFacilities', coords);
        return this.hazardsService.getCriticalFacilities(coords);
      }),
      shareReplay(1)
    );
  }

  get currentCoords$(): Observable<{ lng: number; lat: number }> {
    return this.kyhStore.state$.pipe(
      map((state) => state.currentCoords),
      shareReplay(1)
    );
  }

  get currentCoords(): { lng: number; lat: number } {
    return this.kyhStore.state.currentCoords;
  }

  get currentLocation$(): Observable<string> {
    return this.kyhStore.state$.pipe(map((state) => state.currentLocation));
  }

  get currentPage(): KYHPage {
    return this.kyhStore.state.currentPage;
  }

  get currentPage$(): Observable<KYHPage> {
    return this.kyhStore.state$.pipe(map((state) => state.currentPage));
  }

  get isLoading$(): Observable<boolean> {
    return this.kyhStore.state$.pipe(
      map((state) => state.isLoading),
      shareReplay(1)
    );
  }

  get floodRiskLevel$(): Observable<RiskLevel> {
    return this.kyhStore.state$.pipe(map((state) => state.floodRiskLevel));
  }

  get stormSurgeRiskLevel$(): Observable<RiskLevel> {
    return this.kyhStore.state$.pipe(map((state) => state.stormSurgeRiskLevel));
  }

  get landslideRiskLevel$(): Observable<RiskLevel> {
    return this.kyhStore.state$.pipe(map((state) => state.landslideRiskLevel));
  }

  get hazardTypes(): HazardType[] {
    return ['flood', 'landslide', 'storm-surge'];
  }

  async assessRisk(): Promise<void> {
    this.kyhStore.patch(
      {
        isLoading: true,
        floodRiskLevel: 'unavailable',
        landslideRiskLevel: 'unavailable',
        stormSurgeRiskLevel: 'unavailable',
      },
      'loading risk level...'
    );

    const payloadFlood = {
      coords: this.kyhStore.state.center,
      tilesetName: this._getTilesetName('flood'),
    };
    const payloadStormSurge = {
      coords: this.kyhStore.state.center,
      tilesetName: this._getTilesetName('storm-surge'),
    };
    const payloadLandslide = {
      coords: this.kyhStore.state.center,
      tilesetName: this._getTilesetName('landslide'),
    };

    const floodRiskLevel = await this.hazardsService
      .assess(payloadFlood)
      .toPromise();
    const stormSurgeRiskLevel = await this.hazardsService
      .assess(payloadStormSurge)
      .toPromise();
    const landslideRiskLevel = await this.hazardsService
      .assess(payloadLandslide)
      .toPromise();

    this.kyhStore.patch(
      {
        isLoading: false,
        floodRiskLevel: floodRiskLevel as RiskLevel,
        stormSurgeRiskLevel: stormSurgeRiskLevel as RiskLevel,
        landslideRiskLevel: landslideRiskLevel as RiskLevel,
      },
      `updated risk level --`
    );
  }

  init() {
    this.assessRisk();
    this.criticalFacilities$ = this.getCriticalFacilities$();
  }

  isHazardShown$(hazardType: HazardType): Observable<boolean> {
    return this.kyhStore.state$.pipe(map((state) => state[hazardType].shown));
  }

  isHazardLayer(currentHazard: HazardType): boolean {
    return this.hazardTypes.includes(currentHazard);
  }

  setCenter(center: { lat: number; lng: number }) {
    this.kyhStore.patch({ center }, 'update map center');
    this.assessRisk();
  }

  setCurrentCoords(currentCoords: { lat: number; lng: number }) {
    this.kyhStore.patch({ currentCoords });
  }

  setCurrentLocation(currentLocation: string): void {
    this.kyhStore.patch({ currentLocation }, 'update current location');
    this.gaService.event('change_location', 'know_your_hazards');
  }

  setCurrentPage(currentPage: KYHPage): void {
    this.kyhStore.patch({ currentPage }, 'update current page');

    const newHazardState: Record<HazardType, { shown: boolean }> = {
      flood: {
        shown: currentPage === 'flood' || currentPage === 'know-your-hazards',
      },
      landslide: {
        shown:
          currentPage === 'landslide' || currentPage === 'know-your-hazards',
      },
      'storm-surge': {
        shown:
          currentPage === 'storm-surge' || currentPage === 'know-your-hazards',
      },
    };

    this.kyhStore.patch({ ...newHazardState }, 'show/hide hazards');
  }

  // Temporary
  private _getTilesetName(hazardTypes: HazardType): string {
    switch (hazardTypes) {
      case 'flood':
        return 'upri-noah.ph_fh_100yr_tls,upri-noah.ph_fh_nodata_tls';
      case 'landslide':
        return 'upri-noah.ph_lh_lh1_tls,upri-noah.ph_lh_lh2_tls,upri-noah.ph_lh_lh3_tls';
      case 'storm-surge':
        return 'upri-noah.ph_ssh_ssa4_tls';
      default:
        return '';
    }
  }
}
