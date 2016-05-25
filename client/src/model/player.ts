namespace model {
    export class Player {
        private cash: number;

        constructor(private username_: string) {
        }

        get username(): string {
            return this.username_;
        }

        setCash(amount: number): void {
            this.cash = amount;
        }
    }
}