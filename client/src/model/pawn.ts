namespace model {

    export class ColorManager {
        private colors_: Array<string> = ["red", "yellow", "blue", "white", "black", "green"];
        getColor(index: number): string {
            return this.colors_[index];
        }
    }

    export class Pawn {
        constructor(private color_: string) { }

        get color(): string {
            return this.color_;
        }

        // Board's dictionary uses Pawn's toString() method 
        // to check equality of pawns.
        toString(): string {
            return this.color_;
        }
    }

}