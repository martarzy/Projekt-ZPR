namespace view {
    export class Field {
        // statyczna tablica ze wspolrzednymi kolejnych pol -> tymczasowo
        // @TODO: uzupelnic tablice wartosciami
        // duze - 63
        // male - 50
        private static FieldCoords = [
            // pola na dole (od prawej)
            [580, 585], [517, 585], [465, 585], [415, 585], [365, 585], [315, 585], [265, 585], [215, 585], [165, 585], [115, 585], [52, 585],
            // pola po lewej (od dolu)
            [52, 522], [52, 472], [52, 422], [52, 372], [52, 322], [52, 272], [52, 222], [52, 172], [52, 122],
            // pola u gory (od lewej)
            [52, 59], [115, 59], [165, 59], [215, 59], [265, 59], [315, 59], [365, 59], [415, 59], [465, 59], [517, 59], [580, 59],
            // pola po prawej (od gory)
            [580, 122], [580, 172], [580, 222], [580, 272], [580, 322], [580, 372], [580, 422], [580, 472], [580, 522]
        ];
        private fieldId: number;
        // wspolrzedne srodkow pol
        private coordinateX: number;
        private coordinateY: number;
        private element: HTMLBaseElement;

        constructor(fieldId: number) {
            this.fieldId = fieldId;
            this.coordinateX = Field.FieldCoords[fieldId][0];
            this.coordinateY = Field.FieldCoords[fieldId][1];

            // @TODO: stworzenie elementu svg
        }

        public getCoordX(): number {
            return this.coordinateX;
        }

        public getCoordY(): number {
            return this.coordinateY;
        }

        public getFieldId(): number {
            return this.fieldId;
        }
    }
}