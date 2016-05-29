namespace model {

    export class Board {
        private FIELDS_NUMBER = 40;
        private START_FIELD_NUMBER = 0;
        private JAIL_FIELD_NUMBER = 10;
        private fields_: Array<Field>;

        constructor() {
            this.initializeFields();
        }

        private initializeFields(): void {
            this.fields_ = new Array<Field>(this.FIELDS_NUMBER);
            for (let i = 0; i < this.FIELDS_NUMBER; i++) {
                this.fields_[i] = new Field(i, "", 300, false);
            }
        }

        private getField(id: number): Field {
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
    }

}