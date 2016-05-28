namespace model {

    export class Field {
        ownerUsername_: string = null;

        constructor(private id_: number,
                    private description_: string,
                    private cost_: number,
                    private buyable_: boolean) {
        }

        get id(): number {
            return this.id_;
        }

        get description(): string {
            return this.description_;
        }

        get cost(): number {
            return this.cost_;
        }

        get buyable(): boolean {
            return this.buyable_;
        }

        hasOwner(): boolean {
            return this.ownerUsername_ != null;
        }

        markAsBought(owner: string): void {
            this.ownerUsername_ = owner;
        }
    }

}