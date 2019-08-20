import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from './app.component';
import { Subject, Observable } from 'rxjs';
import * as uuid from 'uuid';


export class WebSocketApiService {

  webSocketEndPoint = 'http://192.168.9.188:8067/ws';
  topic = '/user/queue/sync-devices';
  stompClient: any;
  requestId = null;
  appComponent: AppComponent;
  constructor() {
    this.requestId = uuid.v4();
    console.log('requestId = ', this.requestId);
  }

  _connect(): Observable<any> {
    console.log('Innitialize WebSocket Connection');
    const ws = new SockJS(this.webSocketEndPoint, [], {
      sessionId: () => {
        return this.requestId;
      }
    });
    this.stompClient = Stomp.over(ws);
    const that = this;
    const subject = new Subject();
    that.stompClient.connect({}, () => {
      that.stompClient.subscribe(that.topic, (message) => {
        console.log('hieu dep trai ', message);
        subject.next(message);
      });
    }, this.errorCallBack);
    return subject.asObservable();
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /* Send message to sever via web socket  @param {*} message  */


  _send(message) {
    console.log('calling logout api via web socket', JSON.stringify(message));
    this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  }

}
