namespace model {

    export class Board {
        private FIELDS_NUMBER = 40;
        private START_FIELD_NUMBER = 0;
        private JAIL_FIELD_NUMBER = 10;
        private _fields: Array<Field>;

        constructor() {
            this.initializeFields();
        }

        private initializeFields(): void {
            this._fields = new Array<Field>(this.FIELDS_NUMBER);
            for (let i = 0; i < this.FIELDS_NUMBER; i++) {
                this._fields[i] = new Field(i);
            }
        }

        private getField(id: number): Field {
            return this._fields[id];
        }

        fieldInDistanceOf(field: Field, distance: number): Field {
            let newId = (field.number + distance) % this.FIELDS_NUMBER;
            return this._fields[newId];
        }

        startField(): Field {
            return this.getField(this.START_FIELD_NUMBER);
        }

        jailField(): Field {
            return this.getField(this.JAIL_FIELD_NUMBER);
        }
    }

}