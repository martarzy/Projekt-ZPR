namespace view {
    /**
     * Represents a pawn. Stores a field on which the pawn is set and d3 element which represents this pawn in DOM.
     */
    export class Pawn {
        private field: Field;
        private element: d3.Selection<any>;

        /**
         * Creates a pawn on the start field
         * and sets appropriate color.
         * @param startField    the field on which a pawn is set at the beginning of the game
         * @param color         color of the pawn
         */
        constructor(startField: Field, color: string) {
            this.field = startField;
            this.element = d3.select("#board-svg").append("circle");
            this.element
                .attr("r", 10)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px")
                .style("fill", color)
                .attr("border", "1px solid black");
        }

        /**
         * Moves a pawn on target field.
         * @param target         the field on which a pawn should be set
         * @param sequencenumber a number of fields beetwen a current place and a target one
         */
        move(target: Field, sequencenumber: number): void {
            this.field = target;
            this.element
                .transition()
                .delay(200*sequencenumber)
                .duration(200)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px");
        }

        /**
         * Returns a field on which the pawn is set.
         */
        getPawnField(): Field {
            return this.field;
        }
    }
}