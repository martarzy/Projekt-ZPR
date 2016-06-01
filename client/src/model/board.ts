namespace model {

    export class Board {
        private FIELDS_NUMBER = 40;
        private START_FIELD_NUMBER = 0;
        private JAIL_FIELD_NUMBER = 10;
        private fields_: Array<Field> = [];

        constructor() {
            this.initializeFields();
        }

        private initializeFields(): void {
            this.fields_.push(new Field(this.fields_.length, "Go"));
            this.fields_.push(new Field(this.fields_.length, "Brown", 60, 50));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Brown", 60, 50));
            this.fields_.push(new Field(this.fields_.length, "Income Tax"));
            this.fields_.push(new Field(this.fields_.length, "Railroad", 200));
            this.fields_.push(new Field(this.fields_.length, "Blue", 100, 50));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Blue", 100, 50));
            this.fields_.push(new Field(this.fields_.length, "Blue", 120, 50));

            this.fields_.push(new Field(this.fields_.length, "Jail"));
            this.fields_.push(new Field(this.fields_.length, "Pink", 140, 100));
            this.fields_.push(new Field(this.fields_.length, "Utility", 150));
            this.fields_.push(new Field(this.fields_.length, "Pink", 140, 100));
            this.fields_.push(new Field(this.fields_.length, "Pink", 160, 100));
            this.fields_.push(new Field(this.fields_.length, "Railroad", 200));
            this.fields_.push(new Field(this.fields_.length, "Orange", 160, 100));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Orange", 160, 100));
            this.fields_.push(new Field(this.fields_.length, "Orange", 180, 100));

            this.fields_.push(new Field(this.fields_.length, "Parking"));
            this.fields_.push(new Field(this.fields_.length, "Red", 220, 150));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Red", 220, 150));
            this.fields_.push(new Field(this.fields_.length, "Red", 240, 150));
            this.fields_.push(new Field(this.fields_.length, "Railroad", 200));
            this.fields_.push(new Field(this.fields_.length, "Yellow", 260, 150));
            this.fields_.push(new Field(this.fields_.length, "Yellow", 260, 150));
            this.fields_.push(new Field(this.fields_.length, "Utility", 150));
            this.fields_.push(new Field(this.fields_.length, "Yellow", 280, 150));

            this.fields_.push(new Field(this.fields_.length, "Go to jail"));
            this.fields_.push(new Field(this.fields_.length, "Green", 300, 200));
            this.fields_.push(new Field(this.fields_.length, "Green", 300, 200));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Green", 320, 200));
            this.fields_.push(new Field(this.fields_.length, "Railroad", 200));
            this.fields_.push(new Field(this.fields_.length, "Chance"));
            this.fields_.push(new Field(this.fields_.length, "Navy", 350, 200));
            this.fields_.push(new Field(this.fields_.length, "Luxury tax"));
            this.fields_.push(new Field(this.fields_.length, "Navy", 350, 200));
        }

        getField(id: number): Field {
            return this.fields_[id];
        }

        fieldInDistanceOf(field: Field, distance: number): Field {
            let newId = (field.id + distance) % this.FIELDS_NUMBER;
            return this.fields_[newId];
        }

        startField(): Field {
            return this.getField(this.START_FIELD_NUMBER);
        }

        jailField(): Field {
            return this.getField(this.JAIL_FIELD_NUMBER);
        }

        getFields(): Array<Field> {
            return this.fields_;
        }
    }

}