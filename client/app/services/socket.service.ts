import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Cnvs } from '../../../common/inteface/CnvsMap';
import { CellMap } from '../components/canvas/CellMap';

@Injectable()
export class SocketService {
  private host: string = environment.apiUrl;
  private socket: any;

  static cellsMap = [];

  constructor() {
    this.socket = io(this.host);
    this.socket.on('connect', () => SocketService.connected());
    this.socket.on('disconnect', () => SocketService.disconnected());
    this.socket.on('error', (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect() {
    this.socket.connect();
    this.setMap();
  }

  // Получена карта
  private setMap() {
    this.socket.on('setMap', (cnvMap: Cnvs.Map[]) => {
      console.log('map', cnvMap);
      cnvMap.forEach((rows: any, rowIndex) => {
        SocketService.cellsMap[rowIndex] = [];
        rows.forEach((cellData: Cnvs.Cell,  colIndex: number) => {
          const cell = new CellMap(colIndex, rowIndex, cellData.solid);
          // отрисуем объект
          cell.fill(cell.solid);
          // Сохраняем объект канваса (с позициями, состоянием и тд)
          SocketService.cellsMap[rowIndex][colIndex] = cell;
        });
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  private static connected() {
    console.log('Connected');
  }

  private static disconnected() {
    console.log('Disconnected');
  }

}
