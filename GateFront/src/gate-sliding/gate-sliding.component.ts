import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'gate-sliding',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './gate-sliding.component.html',
  styleUrls: ['./gate-sliding.component.scss'] // corectat de la 'styleUrl' la 'styleUrls'
})
export class GateSlidingComponent  {
  offsetLeft: number = 0;
  public setOffset(status:boolean | undefined){
    if(status===undefined){
      this.offsetLeft=23;
      return;
    }
    if(status){
      this.offsetLeft=-20;
    }else if(!status){
      this.offsetLeft=-90;
    }
  }

  @ViewChild('movingImage', { static: true }) movingImage!: ElementRef<HTMLImageElement>;
  @ViewChild('fade', { static: true }) car!: ElementRef<HTMLImageElement>;

  get offsetStyle() {
    return {
      'transform': `translateX(${this.offsetLeft}%)`,
    };
  }


  startMovingRight() {
    const image = this.movingImage.nativeElement;
    const car = this.car.nativeElement;
    image.classList.remove('moving-left');
    image.classList.add('moving-right');
    car.classList.remove('opac-animation');
    car.classList.add('opac-out-animation');
  }


  startMovingLeft() {
    const image = this.movingImage.nativeElement;
    const car = this.car.nativeElement;
    image.classList.remove('moving-right');
    image.classList.add('moving-left');
    car.classList.remove('opac-out-animation');
    car.classList.add('opac-animation');

  }








}
