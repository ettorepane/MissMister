import { Component } from '@angular/core';
//view child
import { ViewChild } from '@angular/core';
import * as e from 'express';
import { ApiServiceService } from './api-service.service';
//onINIT
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //import #firstCard and #secondCard avoid ts error
  //@ts-ignore
  @ViewChild('firstCard') firstCard;
  //@ts-ignore
  @ViewChild('secondCard') secondCard;

  constructor(private apiService: ApiServiceService) { }

  ngOnInit() {
    //every 3 seconds, check totalplays
    this.apiService.get('totalPlay').subscribe((data: any) => {
      console.log(data.rows[0].totalPlay);
      this.totalPlays = data.rows[0].totalPlay;
    });
    setInterval(() => {
      this.apiService.get('totalPlay').subscribe((data: any) => {
        console.log(data.rows[0].totalPlay);
        this.totalPlays = data.rows[0].totalPlay;
      });
    }
      , 3000);

  }

  title = 'MissMister';
  onPlay = false;
  loading = false;
  isMiss = false;

  firstName = 'Bad Fetch';
  secondName = 'Bad Fetch';

  firstID = 0;
  secondID = 0;

  firstInstagram = '';
  secondInstagram = '';

  firstImage = '';
  secondImage = '';

  totalPlays = 1345;

  onPlayChange() {
    this.onPlay = !this.onPlay;
    this.isMiss = !this.isMiss;
    this.loading = true;
    var url = '';
    if (this.isMiss) {
      url = 'miss';
    }
    else {
      url = 'mister';
    }
    url += '/random';

    this.apiService.get(url).subscribe((data: any) => {
      console.log(data.rows);
      this.firstName = data.rows[0].nome;
      this.secondName = data.rows[1].nome;
      this.firstID = data.rows[0].id;
      this.secondID = data.rows[1].id;
      this.firstInstagram = data.rows[0].instagramURL;
      this.secondInstagram = data.rows[1].instagramURL;
      if (this.isMiss) {
        this.firstImage = "https://ik.imagekit.io/ettoreone/tr:w-501,di-default/miss/" + data.rows[0].id + "?ik-sdk-version=javascript-1.4.3&updatedAt=1675424870437";
        this.secondImage = "https://ik.imagekit.io/ettoreone/tr:w-501,di-default/miss/" + data.rows[1].id;
      } else {
        this.firstImage = "https://ik.imagekit.io/ettoreone/tr:w-501,di-default/mister/" + data.rows[0].id;
        this.secondImage = "https://ik.imagekit.io/ettoreone/tr:w-501,di-default/mister/" + data.rows[1].id;
      }
      this.loading = false;
    });

  }
  cardsShown = true;
  selectOne() {
    //animate card, by flipping it
    this.loading = true;
    //post to server
    var url = 'match';
    //type is 1 for miss and 2 for mister
    var type = 0;
    if (this.isMiss) {
      type = 1;
    } else {
      type = 2;
    }
    //we need to send contender1 and contender2 and the winner, along with the type
    var contender1 = this.firstID;
    var contender2 = this.secondID;
    var winner = this.firstID;
    var body = {
      type: type,
      contender1: contender1,
      contender2: contender2,
      winner: winner
    }
    this.apiService.post(url, body).subscribe((data: any) => {
      this.onPlay = false;
      this.onPlayChange();
    });
  }

  selectTwo() {
    //animate card, by flipping it
    this.loading = true;
    //post to server
    var url = 'match';
    //type is 1 for miss and 2 for mister
    var type = 0;
    if (this.isMiss) {
      type = 1;
    } else {
      type = 2;
    }
    //we need to send contender1 and contender2 and the winner, along with the type
    var contender1 = this.firstID;
    var contender2 = this.secondID;
    var winner = this.secondID;
    var body = {
      type: type,
      contender1: contender1,
      contender2: contender2,
      winner: winner
    }
    this.apiService.post(url, body).subscribe((data: any) => {
      this.onPlay = false;
      this.onPlayChange();
    });
  }

}


