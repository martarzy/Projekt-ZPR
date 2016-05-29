namespace view {
    export class Pawn {
        private field: Field;
        private element: d3.Selection<any>;

        constructor(startField: Field, color: string) {
            this.field = startField;
            this.element = d3.select("svg").append("circle");
            this.element
                .attr("r", 10)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px")
                .style("fill", color);
        }

        public move(target: Field, sequencenumber: number) {
            this.field = target;
            this.element
                .transition()
                .delay(200*sequencenumber)
                .duration(200)
                .attr("cx", this.field.getCoordX() + "px")
                .attr("cy", this.field.getCoordY() + "px");
        }

        public getPawnField(): Field {
            return this.field;
        }
    }
}