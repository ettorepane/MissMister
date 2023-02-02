import { Component } from '@angular/core';
//view child
import { ViewChild } from '@angular/core';

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

  title = 'MissMister';
  onPlay = false;
  loading = false;
  onPlayChange() {
    this.onPlay = !this.onPlay;
    this.loading = true;
    //timeout 300ms to simulate loading
    setTimeout(() => {
      this.loading = false;
    }
    , 1000);
  }
  cardsShown = true;
  selectOne() {
    //animate card, by flipping it
    this.cardsShown = true;
    this.onPlay = false;

    this.onPlayChange();
  }
  selectTwo() {
    this.cardsShown = true;
    this.onPlay = false;
    this.onPlayChange();
  }

}


