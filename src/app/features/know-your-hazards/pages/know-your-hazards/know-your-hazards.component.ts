import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'noah-know-your-hazards',
  templateUrl: './know-your-hazards.component.html',
  styleUrls: ['./know-your-hazards.component.scss'],
})
export class KnowYourHazardsComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('NOAH - Know Your Hazards');
  }
}
