namespace model {

    export class Field {
        constructor(private _number: number) { }

        get number(): number {
            return this._number;
        }
    }

}