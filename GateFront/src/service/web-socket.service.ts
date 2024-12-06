import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Subject } from 'rxjs';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private messages: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
  }

  establishConnection(){
    if (isPlatformBrowser(this.platformId)) {
      this.connect();
    }
  }

  private connect() {
     this.socket = new WebSocket('ws://ronsky.go.ro:1003'); // Connect to WebSocket server


    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      this.getMessages(event.data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setTimeout(() => this.connect(), 1000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageToSend = JSON.stringify(message);
      this.socket.send(messageToSend);
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  }

  private getMessages(message: any) {
    this.messages.next(message);
  }

  getMessagesObservable() {
    return this.messages.asObservable();
  }
}
