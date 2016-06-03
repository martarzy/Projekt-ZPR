namespace model {

    export class Board {
        private FIELDS_NUMBER = 40;
        private START_FIELD_NUMBER = 0;
        static JAIL_FIELD_NUMBER = 10;
        private fields_: Array<Field> = [];

        constructor() {
            this.initializeFields();
        }

        getField(id: number): Field {
            return this.fields_[id];
        }

        fieldInDistanceOf(field: Field, distance: number): Field {
            const newField = field.id + distance;
            let newId = (newField >= 0 ? newField : 40 + newField) % this.FIELDS_NUMBER;
            return this.fields_[newId];
        }

        startField(): Field {
            return this.getField(this.START_FIELD_NUMBER);
        }

        fields(): Array<Field> {
            return this.fields_;
        }

        private initializeFields(): void {
            this.fields_ = [
                new Field(0, "Go"),
                new Field(1, "Brown", 60, 50),
                new Field(2, "Chance"),
                new Field(3, "Brown", 60, 50),
                new Field(4, "Income Tax"),
                new Field(5, "Railroad", 200),
                new Field(6, "Blue", 100, 50),
                new Field(7, "Chance"),
                new Field(8, "Blue", 100, 50),
                new Field(9, "Blue", 120, 50),
                new Field(10, "Jail"),
                new Field(11, "Pink", 140, 100),
                new Field(12, "Utility", 150),
                new Field(13, "Pink", 140, 100),
                new Field(14, "Pink", 160, 100),
                new Field(15, "Railroad", 200),
                new Field(16, "Orange", 160, 100),
                new Field(17, "Chance"),
                new Field(18, "Orange", 160, 100),
                new Field(19, "Orange", 180, 100),
                new Field(20, "Parking"),
                new Field(21, "Red", 220, 150),
                new Field(22, "Chance"),
                new Field(23, "Red", 220, 150),
                new Field(24, "Red", 240, 150),
                new Field(25, "Railroad", 200),
                new Field(26, "Yellow", 260, 150),
                new Field(27, "Yellow", 260, 150),
                new Field(28, "Utility", 150),
                new Field(29, "Yellow", 280, 150),
                new Field(30, "Go to jail"),
                new Field(31, "Green", 300, 200),
                new Field(32, "Green", 300, 200),
                new Field(33, "Chance"),
                new Field(34, "Green", 320, 200),
                new Field(35, "Railroad", 200),
                new Field(36, "Chance"),
                new Field(37, "Navy", 350, 200),
                new Field(38, "Luxury tax"),
                new Field(39, "Navy", 350, 200)
            ];
        }
    }

}