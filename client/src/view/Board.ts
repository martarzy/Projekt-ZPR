/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
namespace view {
    export class Board {
        // pionki - slownik: gracz->pionek
        private pawns: { [playerName: string]: Pawn; } = {};
        // pola
        private fields: Field[] = [];

        constructor() {
            for (let i = 0; i < 40; i++) {
                this.fields[i] = new Field(i);
            }
        }

        public addPawn(pawnName: string, color: string)
        {
            this.pawns[pawnName] = new Pawn(this.fields[0], color);
        }

        public removePawn(pawnName: string)
        {
            delete this.pawns[pawnName];
        }

        public movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any) {
            let sequencenumber = 0;
            for (let i = (this.pawns[pawnName].getPawnField().getFieldId() + 1) % 40;
                i != fieldNumber;
                i = (i + 1) % 40)
            {
                this.pawns[pawnName].move(this.fields[i], sequencenumber++);
            }
            setTimeout(onMovingEnd, sequencenumber*200);
        }
    }
}
