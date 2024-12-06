import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {HttpClient} from "@angular/common/http";
import {GenaralService} from "../service/genaral.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {DatePipe, NgClass} from "@angular/common";
import {WebSocketService} from "../service/web-socket.service";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {CookieService} from "ngx-cookie-service";
import {GateSlidingComponent} from "../gate-sliding/gate-sliding.component";
import {ToggleButtonModule} from "primeng/togglebutton";
import {HistoryType} from "../service/history.type";
import {TableModule} from "primeng/table";
import {interval, Observable, Subscription, switchMap, timer} from "rxjs";
import {TimerService} from "../service/timer.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Button,
    ProgressSpinnerModule,
    NgClass,
    InputTextModule,
    PaginatorModule,
    GateSlidingComponent,
    ToggleButtonModule,
    TableModule,
    DatePipe
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit  {
  checked: boolean = false;
  http = inject(HttpClient);
  service = inject(GenaralService);
   cookieService=inject(CookieService);
  getResponse: boolean | undefined;
  serviceSocket=inject(WebSocketService);
  wait:boolean=false;
  inputValue: string=""
  step:number=1;
  history:HistoryType[]=[];
  constructor(private timerService:TimerService) {
    if(  this.cookieService.get('poarta')=="true"){
      this.checked=true;
    }


  }
  @ViewChild(GateSlidingComponent) child!: GateSlidingComponent;


  ngOnInit(): void {
    if(this.getCookie()!==""){
      this.init()
    }

  }
  init(){
    this.serviceSocket.establishConnection();
    this.getData();
    this.getHistory();
    this.receiveMsg();
  }

  getHistory() {
    this.service.getHistory().subscribe({
      next: (data) => {
        this.history=[];
        data.forEach((item) => {
          if(item.info===""){
            return;
          }
          const his:HistoryType={
            name: String(item.info).split("^")[0],
            action: String(item.info).split("^")[1],
            date: this.convertToDate(String(item.info).split("^")[2]+"/"+String(item.info).split("^")[3])
          }
          this.history.push(his);
        })
        console.log(this.history);
      },
      error: (error) => {
        this.history=[];
      }
    });
  }

  convertToDate(dateString: string): Date {
    const parts = dateString.split('/');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const hh = parseInt(parts[3], 10);
    const mm = parseInt(parts[4], 10);
    const ss = parseInt(parts[5], 10);
    return new Date(year, month, day,hh,mm,ss);
  }




  getData() {
    this.service.get().subscribe({
      next: (data) => {
        this.getResponse= data;
        this.child.setOffset(!this.getResponse);
      },
      error: (error) => {
        this.getResponse=undefined;
        this.child.setOffset(this.getResponse);
        this.wait=true;
      }
    });
  }
  postData(){
    this.service.post(this.getCookie()).subscribe({
      next: (data) => {
       this.wait=false;
      },
      error: (error) => {
        this.getResponse=undefined;
        this.callInChild(this.getResponse);
        this.wait=false;
      }
    });
  }


  onClick() {
  //  this.sendMessage();
    if(this.wait){
      return;
    }
    this.wait=true;
    this.postData()
  }


  receiveMsg(): void {
    this.serviceSocket.getMessagesObservable().subscribe({
      next: (message) => {
        this.getHistory();
        let status;
        try {
          // Parsează mesajul JSON într-un obiect
          const jsonMessage = JSON.parse(message);

          // Afișează status-ul în consolă
          console.log(jsonMessage.status);
          this.getResponse = jsonMessage.status;
          this.callInChild(this.getResponse);
        } catch (error) {
          console.log('Eroare la parsarea mesajului:', message);
        }
      },
      error: (error) => {
        console.log('Eroare la primirea mesajului:', error);
      }
    });
  }






  public onLongPress() {
   this.step=0;
  }



  setCookie(txt:string) {
    this.cookieService.set('userToken', txt, 365); // Cookie cu expirare în 7 zile
  }

  getCookie() {
    return this.cookieService.get('userToken');
  }

  deleteCookie() {
    this.cookieService.delete('userToken');
  }


  getAuth(pass:string){
    this.step=1;
    this.service.getAuth(pass).subscribe({
      next: (data) => {
        this.setCookie(data.auth);
        this.inputValue="";
        alert("Success");
      },
      error: (error) => {
        console.log(error);
        this.inputValue="";
        this.setCookie("");
        alert("You password is incorect");
      }
    });
  }
  saveTokenPoarta(){
    this.cookieService.set('poarta', String(this.checked), 365);
  }

  callInChild(res:boolean|undefined){
    if(!res){
      this.child.startMovingRight()
    }else{
      this.child.startMovingLeft()
    }
  }

}
