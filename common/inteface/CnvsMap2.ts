export namespace Cnvs {
    export interface Map {
        [index: number]: Cell[];
    }

    export interface Cell {
        rowIndex: number;
        colIndex: number;
        solid: boolean;
    }
}
