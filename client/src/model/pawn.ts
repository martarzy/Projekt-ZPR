namespace model {

    export enum Color {
        RED, YELLOW, BLUE, GREEN, BLACK, WHITE
    }

    export class Pawn {
        constructor(private color_: Color) { }

        get color(): Color {
            return this.color_;
        }
    }

}