// Класс объекта на канвасе (ячейка карты)
//
import { Cnvs } from '../../../../common/inteface/CnvsMap';
import Bresenhame from '../../../../common/modules/Bresenhame';
import { canvasSettings } from './canvas-settings';
import { SocketService } from '../../services/socket.service';

export class CellMap {

  rowIndex: any;
  colIndex: any;
  top: any;
  left: any;
  solid: any;
  cellWidth: any;
  cellHeight: any;

  cfg = {
    idSelector: 'cnvGeneral',
    width: 1000,
    height: 700,
    cellWidth: 100,
    cellHeight: 100,
  };

  context: CanvasRenderingContext2D;


  constructor(colI: any, rowI: any, solid: any) {
    // Индексы в массиве объектов
    this.rowIndex = rowI;
    this.colIndex = colI;

    this.top = colI * this.cfg.cellWidth; // Позиция x
    this.left = rowI * this.cfg.cellHeight; // Позиция y
    this.solid = solid; // Выделение ячейки

    const canvas = <HTMLCanvasElement> document.getElementById(this.cfg.idSelector);
    canvas.width = 1000;
    canvas.height = 700;
    this.context = canvas.getContext('2d');

    console.log('fff', this);
  }

  getPack(): Cnvs.Cell {
    return {
      rowIndex: this.rowIndex,
      colIndex: this.colIndex,
      solid: this.solid,
    };
  }

  fill(solid: any = undefined) {
    if (solid == undefined) {
      solid = !this.solid;
    }
    this.context.fillStyle = solid ? '#63e269' : '#4CAF50';
    this.context.fillRect(this.top, this.left, this.cellWidth, this.cellHeight);
    this.drawBorder(solid);
  }

  drawBorder(solid = false) {
    this.context.beginPath();
    this.context.strokeStyle = solid ? '#41b241' : '#44a147';
    this.context.moveTo(this.top - 0.5, this.left - 0.5);
    this.context.lineTo(this.top - 0.5, this.left + 100 - 0.5);
    this.context.lineTo(this.top + 100 - 0.5, this.left + 100 - 0.5);
    this.context.lineTo(this.top + 100 - 0.5, this.left - 0.5);
    this.context.lineTo(this.top - 0.5, this.left - 0.5);
    this.context.stroke();
  }

  // Рисуем брезенхеймом
  static drawLineCellByStartEnd(x1, y1, x2, y2) {
    const points = Bresenhame(x1, y1, x2, y2);
    points.forEach(point => {
      const cell: CellMap = SocketService.cellsMap[point.x][point.y];
      cell.fill();
    });
  }
}
