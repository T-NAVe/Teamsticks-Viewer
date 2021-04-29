import { Component, OnInit } from '@angular/core';
import { Match, Game, participantIdentities, player } from '../../models/match';
import { MatchService } from '../../services/match.service';
import { Global } from '../../services/global';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  providers: [MatchService]
})
export class PlayersComponent implements OnInit {
  public matchs: Array<Match>;
  public games: Array<Game>
  public player: Array<player>;
  public loaded: boolean;
  public iconUrl: string;
  public version: string
  constructor(
    private _matchService: MatchService
  ) { 
    this.games = []
    this.iconUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/"

  }

  ngOnInit(): void {
    this.getMatchs()
  }

  getMatchs(){
      this._matchService.getMatchs().subscribe(
        response =>{
          
          this.matchs = response.matchs;
          this.getUsers()
          console.log(this.matchs);
          for(let i = 0; i<this.matchs.length; i++){
            this.games[i] = this.matchs[i].game;
          };
          console.log(this.games)
        }
        ,error=>{
          console.log(<any>error)
        }
      );
    }
    //need to remove duplicates from the array.
  getUsers(){
      this.player = []
      let accountId = [];
      for(let i = 0; i < this.matchs.length; i++){
        for(let x = 0; x < this.matchs[i].game.participantIdentities.length; x++){
          //changes made to this line, summonerName was replaced to accountId so we don't have duplicates, since summonerName changes
          if ( typeof(accountId.find(element=>element == this.matchs[i].game.participantIdentities[x].player.accountId)) === "undefined"){
            accountId.push(this.matchs[i].game.participantIdentities[x].player.accountId)
            this.player.push(this.matchs[i].game.participantIdentities[x].player)
          }
        } 
      }
      console.log("🐱‍👤🐱‍👤🐱‍👤")
      console.log(this.player)
      this.loaded = true
    }
  //need to config proxy for this to work
  getVersion(){
    this._matchService.getVersion().subscribe(
      response =>{
        this.version = JSON.stringify(response)
      },error=>{
        console.log(<any>error)
      }
    )
    console.log(this.version)
  }

  

}
