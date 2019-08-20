import { Component, OnInit } from '@angular/core';
import { WebSocketApiService } from './web-socket-api.service';
import { HttpClient } from '@angular/common/http';
// declare let $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'websocket-angular';

  webSocketAPI: WebSocketApiService;
  greeting: any;
  name: string;
  constructor(private httpClient: HttpClient) { }
  ngOnInit() {
    this.webSocketAPI = new WebSocketApiService();
    console.log('hai  = ', this.webSocketAPI.requestId);
    const url = 'http://192.168.9.188:8066/devices/sync?deviceType=1&requestId=' + this.webSocketAPI.requestId + '&deploymentId=1';
    this.httpClient.get(url).subscribe();
  }

  connect() {
    this.webSocketAPI._connect().subscribe(data => {
      console.log('hieu deo trai ', data);
      this.greeting = data;
    });
  }

  disconnect() {
    this.webSocketAPI._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }
}
