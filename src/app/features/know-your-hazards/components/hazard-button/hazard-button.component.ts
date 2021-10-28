import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HazardType } from '@features/know-your-hazards/store/kyh.store';

@Component({
  selector: 'noah-hazard-button',
  templateUrl: './hazard-button.component.html',
  styleUrls: ['./hazard-button.component.scss'],
})
export class HazardButtonComponent implements OnInit {
  @Input() hazardType: HazardType;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  buttonAction() {
    this.router.navigateByUrl(`/know-your-hazards/${this.hazardType}`);
  }
}
