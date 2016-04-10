/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
module View {
    export class Board {
        // pionki
        private pawns: Pawn[] = [];
        // pola
        private fields: Field[] = [];

        constructor(pawnsNumber: number) {
            for (var i = 0; i < 40; i++)
                this.fields[i] = new Field(i);
            for (var i = 0; i < pawnsNumber; i++)
                this.pawns[i] = new Pawn(this.fields[0]);
        }

        public movePawn(pawnNumber: number, fieldNumber: number, onMovingEnd: () => any) {
            var sequencenumber = 0;
            for (var i = (this.pawns[pawnNumber].getPawnField().getFieldId() + 1) % 40;
                i <= fieldNumber;
                i = (i + 1) % 40) {
                this.pawns[pawnNumber].move(this.fields[i], sequencenumber++);
            }
            setTimeout(onMovingEnd, sequencenumber*200);
        }
    }
}
