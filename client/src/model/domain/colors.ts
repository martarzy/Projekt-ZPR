namespace model {

    export class ColorManager {
        private colors_: Array<string> = ["red", "yellow", "blue", "white", "black", "green"];
        getColor(index: number): string {
            return this.colors_[index];
        }
    }

}