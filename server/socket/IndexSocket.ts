import * as socketIo from 'socket.io';
import { Cnvs } from '../../common/inteface/CnvsMap';

export class IndexSocket {
  protected io: socketIo.Server;
  protected MAP: Cnvs.Map;
  protected MAX_COL = 10;
  protected MAX_ROW = 7;

  constructor(io: any) {
    this.io = io;
    this.generateMap();
    this.main();
  }

  protected main() {
    this.io.on('connect', (socket: any) => {
      console.log('Конектед клиент');

      socket.emit('setMap', this.MAP);

      socket.on('setPosition', (data: any) => { // установка значения в ячеку
        console.log('setPosition', data);
        this.io.emit('changeMap', [this.setValCell(data)]); // Отослать всем зименение на карте (не всю карту)
      });

      socket.on('disconnect', () => {
        console.log('Дисконектед клиент');
      });

    });
  }

  // Установка значения в ячеку карты
  protected setValCell(data: Cnvs.Cell) {
    const statusNow = this.MAP[data.rowIndex][data.colIndex].solid;

    this.MAP[data.rowIndex][data.colIndex] = {
      rowIndex: data.rowIndex,
      colIndex: data.colIndex,
      solid: !statusNow,
    };

    return this.MAP[data.rowIndex][data.colIndex];
  }

  protected generateMap() {
    this.MAP = [];

    for (let row = 0; row < this.MAX_ROW; row++) {
      this.MAP[row] = [];
      for (let col = 0; col < this.MAX_COL; col++) {
        this.MAP[row][col] = {
          rowIndex: row,
          colIndex: col,
          solid: false,
        };
      }
    }
  }
}

class CnvMap {
  cellList: CnvCell[];
  maxRow: number;
  maxCol: number;

  constructor() {
    this.maxRow = 10;
    this.maxCol = 7;
  }

  static validCell(CnvCell: CnvCell) {
    // if (CnvCell.rowIndex > this.maxRow && CnvCell.colIndex > this.maxCol) {
    //     return false;
    // }
    return true;
  }

  addCell() {
    this.cellList.push(new CnvCell());
  }

  setDataToCell() {

  }
}

class CnvCell implements Cnvs.Cell {
  rowIndex: number;
  colIndex: number;
  solid: boolean;

  constructor() {

  }
}
