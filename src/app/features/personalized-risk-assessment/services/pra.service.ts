import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HazardType, PraStore, PRAPage, RiskLevel } from '../store/pra.store';
@Injectable({
  providedIn: 'root',
})
export class PraService {
  constructor(private http: HttpClient, private praStore: PraStore) {}

  get currentPage$(): Observable<PRAPage> {
    return this.praStore.state$.pipe(map((state) => state.currentPage));
  }

  get riskLevel$(): Observable<RiskLevel> {
    return this.praStore.state$.pipe(map((state) => state.riskLevel));
  }

  async assessRisk(hazardType: HazardType): Promise<void> {
    this.praStore.patch({ isLoading: true });

    const response: FeatureCollection = await this.http
      .get<FeatureCollection>(
        'http://localhost:8080/geoserver/wms?INFO_FORMAT=application/json&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&SERVICE=WMS&VERSION=1.1.1&WIDTH=2&HEIGHT=2&X=1&Y=1&BBOX=124.55999410001472,11.580408358654404,124.56000410001472,11.580418358654404&LAYERS=cite:Biliran_Flood_100year&QUERY_LAYERS=cite:Biliran_Flood_100year&TYPENAME=cite:Biliran_Flood_100year&BUFFER=50&propertyName=Var&feature_count=50'
      )
      .toPromise();

    const riskLevelNum = parseInt(response.features[0].properties?.Var);
    let riskLevel = 'unavailable';
    switch (riskLevelNum) {
      case 0:
        riskLevel = 'little';
        break;
      case 1:
        riskLevel = 'low';
        break;
      case 2:
        riskLevel = 'medium';
        break;
      case 3:
        riskLevel = 'high';
        break;
      default:
        riskLevel = 'unavailable';
        break;
    }
    this.praStore.patch(
      {
        isLoading: false,
        riskLevel: riskLevel as RiskLevel,
      },
      'updated risk level'
    );
  }

  setCurrentPage(currentPage: PRAPage): void {
    this.praStore.patch({ currentPage });

    if (['flood', 'landslide', 'storm-surge'].includes(currentPage)) {
      this.assessRisk(currentPage as HazardType);
    }
  }
}
