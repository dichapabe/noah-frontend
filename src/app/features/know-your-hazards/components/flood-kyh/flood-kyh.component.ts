import { Component, OnInit } from '@angular/core';
import { KyhService } from '@features/know-your-hazards/services/kyh.service';
import { HazardType } from '@features/know-your-hazards/store/kyh.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'noah-flood-kyh',
  templateUrl: './flood-kyh.component.html',
  styleUrls: ['./flood-kyh.component.scss'],
})
export class FloodKyhComponent implements OnInit {
  currentHazard$: Observable<HazardType>;

  constructor(private kyhService: KyhService) {}

  ngOnInit(): void {
    this.currentHazard$ = this.kyhService.currentHazard$;
  }
  viewHazardLayer(currentHazard: HazardType) {
    this.kyhService.setCurrentHazard(currentHazard);
  }
}
