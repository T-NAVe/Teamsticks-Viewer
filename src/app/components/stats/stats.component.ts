import { Component, OnInit, ViewChild} from '@angular/core';
import { Match, Game, participantIdentities, player, stats, participants } from '../../models/match';
import { MatchService } from '../../services/match.service';
import { Global } from '../../services/global';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChartComponent, ApexOptions} from "ng-apexcharts";

import {  
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
  ApexMarkers
} from "ng-apexcharts";

export type ChartOptions = {
  options: ApexOptions,
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: "Win Rate"
};

export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: any;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
};



@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  providers: [MatchService]
})
export class StatsComponent implements OnInit {
  public matchs: Array<Match>;
  public stats: Array<stats>
  public meanStat: stats = new stats;
  public participant: Array<participants>
  public games: Array<Game>
  public id: number
  public index: number;
  public loaded: boolean;
  public wins: number;
  public surrenders: number;
  public pentakills: number;
  public quadrakills: number;
  public triplekills: number;
  public doublekills: number;
  public summonerName: string;
  public ammountGames: number;
  public opgg: SafeResourceUrl;
  public loses:number;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  

  constructor(
    private _matchService: MatchService,
    private _route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.loaded = false;
    this.wins = 0;
    this.doublekills = 0;
    this.triplekills = 0;
    this.quadrakills = 0;
    this.pentakills = 0;
   }

  ngOnInit(): void {
    this._route.params.subscribe(params =>{
      this.id = parseInt(params.id); 
      this.getSummoner(this.id);
    });
  }
  getSummoner(id){
    this._matchService.getSummoners(id).subscribe(
      response =>{
        this.matchs = response.matchs
        console.log(this.matchs);
        this.getStats()
      },error =>{
        console.log(<any>error);
      }
    )
  }
  getStats(){
    this.games = []
    this.participant = []
    this.stats = []
    this.matchs.forEach((m, index)=>{
      this.games[index] = m.game;
      this.games[index].participantIdentities
        .forEach((pi, index) =>{
          if (this.id == pi.player.currentAccountId){
            this.index=pi.participantId
            //should do this outside of the for loop but meh...
            this.summonerName =  pi.player.summonerName;
            this.opgg =  this.sanitizer.bypassSecurityTrustResourceUrl("https://las.op.gg/summoner/userName="+this.summonerName.replace(/\s/g, ''))
          };
        });
      this.games[index].participants
        .forEach((p, index)=>{
          if(this.index ==p.participantId){
            this.participant.push(p)
            this.stats.push(p.stats)
          };
        });
    });

  console.log(this.participant)
  this.meanStats()
  }

  meanStats(){
    this.stats.forEach((m, i, array)=>{
      for (let [key, value] of Object.entries(m)) {
        if(typeof(this.meanStat[key])=="undefined" && typeof(value)=="number"){
          this.meanStat[key] = 0
        }else if(typeof(this.meanStat[key])=="undefined" && typeof(value)=="boolean"){
          this.meanStat[key] = false          
        }
        if (typeof(value) == "number"){
          let aux: number = this.meanStat[key]
          if (key == "largestCriticalStrike" || key == "largestKillingSpree"||key == "largestMultiKill"){
            if(value > this.meanStat[key]){
              this.meanStat[key] = value
            }
          }else if (key == "doubleKills"|| key=="tripleKills"|| key == "quadraKills" || key=="pentakills"){
            switch (key) {
              case "doubleKills":
                this.doublekills +=value
                aux+=value
                this.meanStat[key] = aux                
                break;
              case "tripleKills":
                this.triplekills +=value
                aux+=value
                this.meanStat[key] = aux  

                break;
              case  "quadraKills":
                this.quadrakills +=value
                aux+=value
                this.meanStat[key] = aux  
                break;
              case "pentakills":
                this.pentakills +=value
                aux+=value
                this.meanStat[key] = aux  
                break;        
              default:
                break;
            }
          }else{
            aux+=value;
            this.meanStat[key] = aux;
          }
        }     
        if(typeof(value)== "boolean"){
          switch (key) {
            case "win":
                if(value == true){
                  this.wins ++
                }
              break;
          
            default:
              break;
          }
        }
    }
      });
    Object.keys(this.meanStat).forEach((key) => {
      if (typeof(this.meanStat[key])== "number"){
        if(key != "largestCriticalStrike" && key != "largestKillingSpree" && key != "largestMultiKill"){
          this.meanStat[key] = this.meanStat[key]/this.stats.length
        }        
      }      
    })
    this.ammountGames = this.stats.length;
    this.loaded = true;
    this.loses = this.ammountGames - this.wins;
    this.generateChartOptions()
    }
    //sloppy tab menu, should make it a proper angular tab system, but works
    openTab(event: any, tabName) {
      var i, x, tablinks;
      x = document.getElementsByClassName("content-tab");
      for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tab");
      for (i = 0; i < x.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" is-active", "");
      }
      document.getElementById(tabName).style.display = "block";
      event.currentTarget.className += " is-active";
    }
    generateChartOptions() {
      this.chartOptions = {
        options:{
          colors: ["#87b6dd","#eb7753"]
        },
        series: [this.wins, this.loses],
        chart: {
          type: "donut"
        },
        labels: ["Wins", "loses"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {                
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
             
      };
    }
  
}

/*getProject(id){
    this._projectService.getProject(id).subscribe(
      response =>{
        this.project = response.project;
      }
    ),error =>{
      console.log(error);
    }
  }
 processMatches() {
   this._matchService.getMatches().pipe(
      tap(response => {
         this.matches = response.matchs;
         let accountId = {};            

         this.matches.forEach((m, index) => {
            this.game[index] = m[index].game;
            this.game[index].participantIdentities
                .forEach(p => {
                    if (!accountId[p.player.sumonerName]) {
                        accountId[p.player.sumonerName] = p.player.sumonerName;
                        this.player.push(p.player);
                    }
                });      
             });

         })
     )
 } 
*/
