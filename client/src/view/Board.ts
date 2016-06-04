/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
namespace view {
    export class Board {
        // pionki - slownik: gracz->pionek
        private pawns: { [playerName: string]: Pawn; } = {};
        // pola
        private fields: Field[] = [];

        constructor() {
            for (let i = 0; i < 40; i++) {
                this.fields[i] = new Field(i);
            }
            this.createFieldInfoWindow("red", "Kraków");
            this.addEventToInfoWindow(16);
        }

        // Opakowane zdarzenie mouseover na wybranym polu
        public addEventToInfoWindow(fieldNumber: number) {
            var fieldRect = d3.select("#hotel-field-" + fieldNumber);
            var infoWindow = document.querySelector("#field-info-window");

            fieldRect.on("mouseover", function () {
                infoWindow.setAttribute("visibility", "visible");
            }).on("mouseout", function () {
                infoWindow.setAttribute("visibility", "hidden");
            });
        }

        // Tworzenie okienka z danymi pola
        public createFieldInfoWindow(color: string, info: string) {
            var g = d3.select("#board-svg")
                .append("g");

            g.attr("id","field-info-window");
            g.attr("visibility", "hidden");

            g.append("rect")
                .attr("x", 270)
                .attr("y", 205)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 300)
                .attr("height", 50)
                .attr("fill", color)
                .attr("stroke", "black")
                .attr("id", "field-window-info-color");

            // glowny prostokat
            g.append("rect")
                .attr("x", 270)
                .attr("y", 250)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 300)
                .attr("height", 400)
                .attr("fill", "whitesmoke")
                .attr("stroke", "black")
                .attr("id", "field-window-info-main");

            // tytul pola
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 300)
                .text("Kraków")
                .attr("fill", "black")
                .attr("font-size", "xx-large")
                .attr("font-weight", "bold");;

            // koszt budowy domu/hotelu

            // czynsz 
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 340)
                .text("Czynsz ")                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "large")
                .attr("font-weight", "bold");
            // jeden dom
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 380)
                .text("Z jednym domem ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena z jednym domem
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 380)
                .text(20)                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "medium");
            // dwa domy
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 410)
                .text("Z dwoma domami ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena - dwa domy
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 410)
                .text(200)                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "medium");
            // trzy domy
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 440)
                .text("Z trzema domami ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena- trzy domy
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 440)
                .text(300)                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cztery domy
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 470)
                .text("Z czterema domami ")                       
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena - cztery domy
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 470)
                .text(200)                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "medium");
            // hotel
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 500)
                .text("Z HOTELEM ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena - hotel
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 500)
                .text(1000)                        // dopisac cene
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do kupowania
            g.append("rect")
                .attr("x", 300)
                .attr("y", 530)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("id", "buy-button");
            // tekst "Buduj"
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 350)
                .attr("y", 555)
                .text("Buduj")
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do sprzedawania
            g.append("rect")
                    .attr("x", 440)
                    .attr("y", 530)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("width", 100)
                    .attr("height", 40)
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("id", "sell-button");
            // tekst "Sprzedaj"
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 490)
                .attr("y", 555)
                .text("Sprzedaj")
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do zastawiania
            g.append("rect")
                .attr("x", 300)
                .attr("y", 595)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("id", "mortgage-button");
            // tekst "Zastaw"
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 350)
                .attr("y", 620)
                .text("Zastaw")
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do wykupowania
            g.append("rect")
                .attr("x", 440)
                .attr("y", 595)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("id", "unmortgage-button");
            // tekst "Wykup"
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 490)
                .attr("y", 620)
                .text("Wykup")
                .attr("fill", "black")
                .attr("font-size", "medium");
        }

        public addPawn(pawnName: string, color: string)
        {
            this.pawns[pawnName] = new Pawn(this.fields[0], color);
        }

        public removePawn(pawnName: string)
        {
            delete this.pawns[pawnName];
        }

        public movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any) {
            let sequencenumber = 0;
            for (let i = (this.pawns[pawnName].getPawnField().getFieldId() + 1) % 40;
                i != fieldNumber;
                i = (i + 1) % 40)
            {
                this.pawns[pawnName].move(this.fields[i], sequencenumber++);
            }
            this.pawns[pawnName].move(this.fields[fieldNumber], sequencenumber);
            setTimeout(onMovingEnd, sequencenumber*200);
        }

        public getField(fieldNumber: number): Field {
            return this.fields[fieldNumber];
        }
    }
}
