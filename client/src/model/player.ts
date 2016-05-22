namespace model {
    export class Player {
        private cash: number;

        constructor(private username_: string) {
            this.cash = 1000;
        }

        get username(): string {
            return this.username_;
        }

        addCash(amount: number): void {
            this.cash += amount;
        }

        removeCash(amount: number): void {
            this.cash -= amount;
        }
    }
}