﻿namespace model {
    export class Player {
        private cash_ = 0;

        constructor(private username_: string) {
        }

        get username(): string {
            return this.username_;
        }

        get cash(): number {
            return this.cash_;
        }

        setCash(amount: number): void {
            this.cash_ = amount;
        }
    }
}