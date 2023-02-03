import { Component } from '@angular/core';
//view child
import { ViewChild } from '@angular/core';
import * as e from 'express';
import { ApiServiceService } from './api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //import #firstCard and #secondCard avoid ts error
  //@ts-ignore
  @ViewChild('firstCard') firstCard;
  //@ts-ignore
  @ViewChild('secondCard') secondCard;

  constructor(private apiService: ApiServiceService) { }

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
        this.firstImage = "https://ik.imagekit.io/ettoreone/tr:w-500,di-default/miss/" + data.rows[0].id;
        this.secondImage = "https://ik.imagekit.io/ettoreone/tr:w-500,di-default/miss/" + data.rows[1].id;
      } else {
        this.firstImage = "https://ik.imagekit.io/ettoreone/tr:w-500,di-default/mister/" + data.rows[0].id;
        this.secondImage = "https://ik.imagekit.io/ettoreone/tr:w-500,di-default/mister/" + data.rows[1].id;
      }
      this.loading = false;
    });

  }
  cardsShown = true;
  selectOne() {
    //animate card, by flipping it
    this.loading = true;
    //post to server


    this.onPlay = false;
    this.onPlayChange();
  }
  selectTwo() {
    this.onPlay = false;
    this.onPlayChange();
  }

}


