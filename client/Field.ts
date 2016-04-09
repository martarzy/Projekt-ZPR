module View {
    export class Field {
        // statyczna tablica ze wspolrzednymi kolejnych pol -> tymczasowo
        // @TODO: uzupelnic tablice wartosciami
        private static FieldCoords = [
            // pola na dole (od lewej)
            [], [], [], [], [], [], [], [], [], [],
            // pola po lewej (od dolu)
            [], [], [], [], [], [], [], [], [], [],
            // pola u gory (od prawej)
            [], [], [], [], [], [], [], [], [], [],
            // pola po prawej (od gory)
            [], [], [], [], [], [], [], [], [], []
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