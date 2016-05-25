namespace model {
    export class Player {
        private cash: number;

        constructor(private username_: string) {
            this.cash = 1000;
        }

        get username(): string {
            return this.username_;
        }

        setCash(amount: number): void {
            this.cash = amount;
        }
    }
}