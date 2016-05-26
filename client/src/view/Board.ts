/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
namespace view {
    export class Board {
        // pionki - slownik: gracz->pionek
        private pawns: { [playerName: string]: Pawn; } = {};
        // pola
        private fields: Field[] = [];

        constructor() {
            // @todo --> tu bedzie tworzona plansza
        }

        public addPawn(pawnName: string)
        {
            this.pawns[pawnName] = new Pawn(this.fields[0]);
        }

        public removePawn(pawnName: string)
        {
            delete this.pawns[pawnName];
        }

        public movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any) {
            var sequencenumber = 0;
            for (var i = (this.pawns[pawnName].getPawnField().getFieldId() + 1) % 40;
                i <= fieldNumber;
                i = (i + 1) % 40)
            {
                this.pawns[pawnName].move(this.fields[i], sequencenumber++);
            }
            setTimeout(onMovingEnd, sequencenumber*200);
        }
    }
}
