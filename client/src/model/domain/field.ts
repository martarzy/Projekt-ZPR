namespace model {

    export class Field {
        static MAX_HOUSES = 5;
        private ownerUsername_ = "";
        private mortgaged_ = false;
        private housesBuilt_ = 0;

        constructor(private id_: number,
                    private group_: string,
                    private fieldCost_: number = 0,
                    private houseCost_: number = 0) {
        }

        get id(): number {
            return this.id_;
        }

        get group(): string {
            return this.group_;
        }

        get cost(): number {
            return this.fieldCost_;
        }

        get houseCost(): number {
            return this.houseCost_;
        }

        get housesBuilt(): number {
            return this.housesBuilt_;
        }

        get isMortgaged(): boolean {
            return this.mortgaged_;
        }

        isBuyable(): boolean {
            return this.fieldCost_ > 0
                && !this.hasOwner();
        }

        buildable(): boolean {
            return this.houseCost_ > 0
                   && !this.mortgaged_
                   && this.housesBuilt_ < Field.MAX_HOUSES;
        }

        private hasOwner(): boolean {
            return this.ownerUsername_ !== "";
        }

        markAsBought(owner: string): void {
            if (this.isBuyable())
                this.ownerUsername_ = owner;
        }

        ownerUsername(): string {
            return this.ownerUsername_;
        }

        mortgage(decision: boolean): void {
            this.mortgaged_ = decision;
        }

        buyHouse(): void {
            this.housesBuilt_ += 1;
        }

        sellHouse(): void {
            this.housesBuilt_ -= 1;
        }
    }

}