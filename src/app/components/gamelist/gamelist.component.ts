import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Match, Game, participantIdentities, player, stats, participants } from '../../models/match';
import { ChartComponent } from "ng-apexcharts";


import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: "Win Rate"
};


@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {
  @Input() games: Array<Game>
  public participantIdentities: Array<participantIdentities>
  public participants: Array<participants>;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public squareUrl = "https://cdn.communitydragon.org/10.9.1/champion/";
  
  constructor() {

   }

  ngOnInit(): void {    
    this.participants = [];
    this.participantIdentities = [];
    for(let i = 0; i < this.games.length; i++){
      this.games[i].participants.forEach(p =>{
        this.participants[i] = p
      });
      this.games[i].participantIdentities.forEach(p =>{
        this.participantIdentities[i] = p
      });        
    }
  }
   
    
  
  


}
