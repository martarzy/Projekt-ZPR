﻿/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
namespace view {
    export class Board {
        // pionki - slownik: gracz->pionek
        private pawns: { [playerName: string]: Pawn; } = {};
        // pola
        private fields: Field[] = [];
        private cardLocked: boolean = false;

        constructor() {
            for (let i = 0; i < 40; i++) {
                this.fields[i] = new Field(i);
                this.addEventToInfoWindow(i);
            }
        }

        // Opakowane zdarzenie click na wybranym polu
        public addEventToInfoWindow(fieldNumber: number) {
            var fieldRect = d3.select("#hotel-field-" + fieldNumber);
            var fieldDesc = Field.FieldDescription[fieldNumber];
            var infoWindow = d3.select("#field-info-window");

            fieldRect.on("click", () => {
                this.removeFieldInfoWindow();
                this.createFieldInfoWindow(fieldDesc.color, fieldDesc.name, fieldDesc.rent,
                        fieldDesc.oneHouse, fieldDesc.twoHouses, fieldDesc.threeHouses, fieldDesc.fourHouses,
                        fieldDesc.hotel, fieldDesc.buildHouse);
                this.cardLocked = true;
            });

            fieldRect.on("mouseover", () => {
                if (this.cardLocked)
                    return;
                this.removeFieldInfoWindow();
                this.createFieldInfoWindow(fieldDesc.color, fieldDesc.name, fieldDesc.rent,
                    fieldDesc.oneHouse, fieldDesc.twoHouses, fieldDesc.threeHouses, fieldDesc.fourHouses,
                    fieldDesc.hotel, fieldDesc.buildHouse);
            });

            fieldRect.on("mouseout", () => {
                if (this.cardLocked)
                    return;
                this.removeFieldInfoWindow();
            });

            d3.select("#close-button-rect").on("click", () => {
                this.cardLocked = false;
                this.removeFieldInfoWindow();
            });
        }

        public removeFieldInfoWindow() {
            var g = d3.select("#field-info-window");
            g.remove();
        }

        // Tworzenie okienka z danymi pola
        public createFieldInfoWindow(color: string, town: string, rent: string, oneHouse: string, twoHouses: string,
                                     threeHouses: string, fourHouses: string, hotel: string, buildHouse: string) {
            var g = d3.select("#board-svg")
                .append("g");

            g.attr("id","field-info-window");

            g.append("rect")
                .attr("x", 270)
                .attr("y", 205)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 300)
                .attr("height", 50)
                .attr("fill", color)
                .attr("stroke", "black")
                .attr("id", "field-info-window-color");
            // przycisk do zamykania okna
            /*g.append('text')
                .text('X')
                .attr("x", 540)
                .attr("y", 220)
                .attr("font-size", "20px")
                .attr("fill", "black")
                .attr("id", "close-button-X");*/
            g.append("rect")
                .attr("x", 540)
                .attr("y", 220)
                .attr("width", 20)
                .attr("height", 20)
                .attr("id", "close-button-rect")
                .attr("fill", "white")
                .attr("opacity", 0.7);

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
                .attr("id", "field-info-window-main");

            // tytul pola
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 300)
                .text(town)
                .attr("fill", "black")
                .attr("font-size", "xx-large")
                .attr("font-weight", "bold");;

            // koszt budowy domu/hotelu
            // czynsz 
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 340)
                .text("Czynsz   " + rent)                        
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
                .text(oneHouse)                        
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
                .text(twoHouses)                     
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
                .text(threeHouses)                      
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
                .text(fourHouses)                        
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
                .text(hotel)                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // napis - koszt budowy domu
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 530)
                .text("Koszt budowy domu ")
                .attr("fill", "black")
                .attr("font-size", "medium");
            // cena - koszt budowy domu
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 530)
                .text(buildHouse)
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do kupowania
            g.append("rect")
                .attr("x", 300)
                .attr("y", 540)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("id", "buy-house-button");
            // tekst "Buduj"
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 350)
                .attr("y", 565)
                .text("Buduj")
                .attr("fill", "black")
                .attr("font-size", "medium");
            // "guzik" do sprzedawania
            g.append("rect")
                    .attr("x", 440)
                    .attr("y", 540)
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
                .attr("y", 565)
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
