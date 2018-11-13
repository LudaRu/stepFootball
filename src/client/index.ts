/// <reference path="modules/tools/socket.io-client.d.ts"/>
import { EventEmitter }  from "./modules/tools/EventEmitter";
import { Cnvs } from "../../common/inteface/CnvsMap";

import { Bresenhame } from "./modules/tools/Bresenhame";
import { Test } from "./modules/tools/Test";

const socket = io();
const emitter = new EventEmitter();
let canvas: any;
let context: any;
let cellsMap: any;
cellsMap = [];

socket.on("setMap", function (data: Cnvs.Map) {
    console.log(data);
});

const cellWidth = 100;
const cellHeight = 100;


canvas = document.getElementById("ctx");
canvas.width = 1000;
canvas.height = 700;
context = canvas.getContext("2d");

socket.on("setMap", (cnvMap: Cnvs.Map[]) => { // Пришла карта с бека
    console.log("map", cnvMap);
    cnvMap.forEach((rows: any, rowIndex) => {

        cellsMap[rowIndex] = [];
        rows.forEach((cellData: Cnvs.Cell,  colIndex: number) => {
            const cell = new CellMap(colIndex, rowIndex, cellData.solid);
            // отрисуем объект
            cell.fill(cell.solid);
            // Сохраняем объект канваса (с позициями, состоянием и тд)
            cellsMap[rowIndex][colIndex] = cell;
        });
    });
});


socket.on("changeMap", (deltaMap: any) => {
    deltaMap.forEach((cellData: any) => {
        const cell = cellsMap[cellData.rowIndex][cellData.colIndex];
        cell.fill(cellData.solid);
    });
});

// Класс объекта на канвасе (ячейка карты)
//
class CellMap {

    rowIndex: any;
    colIndex: any;
    top: any;
    left: any;
    solid: any;

    constructor(colI: any, rowI: any, solid: any) {
        // Индексы в массиве объектов
        this.rowIndex = rowI;
        this.colIndex = colI;

        this.top = colI * cellWidth; // Позиция x
        this.left = rowI * cellHeight; // Позиция y
        this.solid = solid; // Выделение ячейки
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
        context.fillStyle = solid ? "#63e269" : "#4CAF50";
        context.fillRect(this.top, this.left, cellWidth, cellHeight);
        this.drawBorder(solid);
    }

    drawBorder(solid = false) {
        context.beginPath();
        context.strokeStyle = solid ? "#41b241" : "#44a147";
        context.moveTo(this.top - 0.5, this.left - 0.5);
        context.lineTo(this.top - 0.5, this.left + 100 - 0.5);
        context.lineTo(this.top + 100 - 0.5, this.left + 100 - 0.5);
        context.lineTo(this.top + 100 - 0.5, this.left - 0.5);
        context.lineTo(this.top - 0.5, this.left - 0.5);
        context.stroke();
    }

    // Рисуем брезенхеймом
    static drawLineCellByStartEnd(x1, y1, x2, y2) {
        const points = Bresenhame(x1, y1, x2, y2);
        points.forEach(point => {
            const cell: CellMap =  cellsMap[point.x][point.y];
            cell.fill();
        });
    }
}


function getPontsBresenhame(x1, y1, x2, y2 ) { // fixme сделать асинхронным
    const deltaX = Math.abs(x2 - x1),
        deltaY = Math.abs(y2 - y1),
        signX = x1 < x2 ? 1 : -1,
        signY = y1 < y2 ? 1 : -1,
        points = [];

    let error = deltaX - deltaY;

    while (x1 !== x2 || y1 !== y2) {
        points.push({x: x1, y: y1});
        const error2 = error * 2;
        if (error2 > -deltaY) {
            error -= deltaY;
            x1 += signX;
        }
        if (error2 < deltaX) {
            error += deltaX;
            y1 += signY;
        }
    }
    points.push({x: x2, y: y2});

    return points;
}



//  =========
// Events - вынести в управление
//  ========


const startStopClick = {
    start: <any> false,
    stop: <any> false,
};

// ЛОгика работы с влагом конча и начала отрезка ( 2 клика по карте)
function setClickDouble(x, y) {
    (startStopClick.start) ? startStopClick.stop = {x, y} : startStopClick.start = {x, y};

    // Совершено 2 нажатия
    if (startStopClick.start && startStopClick.stop) {
        emitter.emit("clickDouble", startStopClick);
        startStopClick.start = false;
        startStopClick.stop = false;
    }
}


emitter.subscribe("clickDouble", data => {
    console.log("clickDouble", data);
    CellMap.drawLineCellByStartEnd(data.start.x, data.start.y, data.stop.x, data.stop.y);
});


document.addEventListener("mousedown", (event) => {
    const cellObj = getCanvasCellByPosition(event.layerX, event.layerY);
    const StartStop = setClickDouble(event.layerX, event.layerY);
    sendChangeMap(cellObj.getPack());
});

function sendChangeMap(cellObj: Cnvs.Cell) {
    socket.emit("setPosition", cellObj);
}

/* Выборка объекта канваса по X Y курсора*/
function getCanvasCellByPosition(x: any, y: any): CellMap {
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    return cellsMap[row][col];
}
