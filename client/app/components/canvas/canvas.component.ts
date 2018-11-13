import { Component, OnInit } from '@angular/core';
import { canvasSettings } from './canvas-settings';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-canvas',
  template: `
    <canvas
      id="{{cfg.idSelector}}"
      width="{{cfg.width}}"
      height="{{cfg.height}}"
      (mousemove)="redrawWrapper($event)"
    ></canvas>`,
})
export class CanvasComponent implements OnInit {
  cfg = {
    idSelector: 'cnvGeneral',
    width: 1000,
    height: 700,
    cellWidth: 100,
    cellHeight: 100,
  };

  constructor(
    private socketService: SocketService
  ) {
    console.log('cfg', this.cfg);
  }

  redrawWrapper(event: MouseEvent) {

  }

  ngOnInit() {
    console.log(this.socketService);
    // this.socketService.connect()
  }

}
