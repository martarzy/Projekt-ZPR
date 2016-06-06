namespace model {

    export class Colors {
        private colors_: Array<string> = ["#ff9999", "#85e085", "#ffff66", "#99ddff", "white", "#ff80ff"];
        getColor(index: number): string {
            return this.colors_[index];
        }
    }

}