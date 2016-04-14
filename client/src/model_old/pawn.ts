namespace model {

    export enum PawnColor {
        RED, BLUE, YELLOW, GREEN, BLACK, WHITE
    }

    export class Pawn {
        constructor(private _color: PawnColor) { }

        get color(): PawnColor {
            return this._color;
        }
    }

}