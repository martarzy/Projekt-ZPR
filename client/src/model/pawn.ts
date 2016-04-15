namespace model {

    export enum Color {
        RED, YELLOW, BLUE, GREEN, BLACK, WHITE
    }

    export class Pawn {
        constructor(private color_: Color) { }

        get color(): Color {
            return this.color_;
        }

        // Board's dictionary uses Pawn's toString() method 
        // to check equality of pawns.
        toString(): string {
            return this.color_.toString();
        }
    }

}