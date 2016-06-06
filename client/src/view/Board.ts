/// <reference path="Pawn.ts" />
/// <reference path="Field.ts" />
namespace view {
    /**
     * Represents a game board.
     */
    export class Board {
        /** 
        * A dictionary: player->pawn
        */
        private pawns: { [playerName: string]: Pawn; } = {};

        /**
        * A table of fields.
        */
        private fields: Field[] = [];
        /** 
        * To check if a player clicked on a field's information card to take an action of building etc. 
        */
        private cardLocked: boolean = false;

        /**
         * Creates fields and adds an event on fields to show field's information card after clicking. 
         */
        constructor() {
            for (let i = 0; i < 40; i++) {
                this.fields[i] = new Field(i);
                this.addEventToInfoWindow(i);
            }
        }

        // Opakowane zdarzenie click na wybranym polu
        /**
         * Adds an event that a player can show a filed's information window after clicking on chosen field.
         * @param fieldNumber field's number
         */
        addEventToInfoWindow(fieldNumber: number): void {
            var fieldRect = d3.select("#hotel-field-" + fieldNumber);
            var fieldDesc = Field.FieldDescription[fieldNumber];
            var infoWindow = d3.select("#field-info-window");
            var closeButton = d3.select("#close-button-rect");

            fieldRect.on("click", () => {
                this.removeFieldInfoWindow();
                this.createFieldInfoWindow(fieldDesc.color, fieldDesc.name, fieldDesc.rent,
                        fieldDesc.oneHouse, fieldDesc.twoHouses, fieldDesc.threeHouses, fieldDesc.fourHouses,
                        fieldDesc.hotel, fieldDesc.buildHouse);
                this.cardLocked = true;
            });

            fieldRect.on("mouseover", () => {
                d3.select("#board-svg").attr("cursor", "pointer");
                if (this.cardLocked)
                    return;
                this.removeFieldInfoWindow();
                this.createFieldInfoWindow(fieldDesc.color, fieldDesc.name, fieldDesc.rent,
                    fieldDesc.oneHouse, fieldDesc.twoHouses, fieldDesc.threeHouses, fieldDesc.fourHouses,
                    fieldDesc.hotel, fieldDesc.buildHouse);
            });

            fieldRect.on("mouseout", () => {
                d3.select("#board-svg").attr("cursor", "default");
                if (this.cardLocked)
                    return;
                this.removeFieldInfoWindow();
            });
        }

        /**
         * Removes a filed's information window from DOM
         */
        removeFieldInfoWindow(): void {
            var g = d3.select("#field-info-window");
            g.remove();
        }

        // Tworzenie okienka z danymi pola
        /**
         * Creates a window with information about a field.
         * @param color field's color
         * @param town town's name
         * @param rent price for staying on the field without houses
         * @param oneHouse price for staying on the field with one house
         * @param twoHouses price for staying on the field with two houses
         * @param threeHouses price for staying on the field with three houses
         * @param fourHouses price for staying on the field with four houses
         * @param hotel price for staying on the field with hotel 
         * @param buildHouse price for building one house
         */
        createFieldInfoWindow(color: string, town: string, rent: string, oneHouse: string, twoHouses: string,
                                     threeHouses: string, fourHouses: string, hotel: string, buildHouse: string): void {
            var g = d3.select("#board-svg")
                .append("g");

            g.attr("id","field-info-window");

            // kolorowy pasek 
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

            // button to close window
            var exit_button = g.append("g").attr("id", "field-info-close-button");
            exit_button.append("rect")
                .attr("x", 540)
                .attr("y", 220)
                .attr("width", 20)
                .attr("height", 20)
                .attr("id", "close-button-rect")
                .attr("fill", "white")
                .attr("rx", 3)
                .attr("ry", 3)

            exit_button.append('text')
                .text('X')
                .attr("x", 550)
                .attr("y", 236)
                .attr("text-anchor", "middle")
                .attr("font-size", "16px")
                .attr("fill", "black");

            exit_button.on("click", () => {
                this.cardLocked = false;
                this.removeFieldInfoWindow();
                d3.select("#board-svg").attr("cursor", "default");
            });
            exit_button.on("mouseover", () => {
                d3.select("#board-svg").attr("cursor", "pointer");
            });
            exit_button.on("mouseout", () => {
                d3.select("#board-svg").attr("cursor", "default");
            });


            // main rectangle
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

            // title
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 300)
                .text(town)
                .attr("fill", "black")
                .attr("font-size", "xx-large")
                .attr("font-weight", "bold");;

            // rent
            g.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 420)
                .attr("y", 340)
                .text("Czynsz   " + rent)                        
                .attr("fill", "black")
                .attr("font-size", "large")
                .attr("font-weight", "bold");
            // one house
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 380)
                .text("Z jednym domem ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 380)
                .text(oneHouse)                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // two houses
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 410)
                .text("Z dwoma domami ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 410)
                .text(twoHouses)                     
                .attr("fill", "black")
                .attr("font-size", "medium");
            // three houses
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 440)
                .text("Z trzema domami ")                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 440)
                .text(threeHouses)                      
                .attr("fill", "black")
                .attr("font-size", "medium");
            // four houses
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 470)
                .text("Z czterema domami ")                       
                .attr("fill", "black")
                .attr("font-size", "medium");
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
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 500)
                .text(hotel)                        
                .attr("fill", "black")
                .attr("font-size", "medium");
            // price - build house
            g.append("text")
                .attr("text-anchor", "start")
                .attr("x", 290)
                .attr("y", 530)
                .text("Koszt budowy domu ")
                .attr("fill", "black")
                .attr("font-size", "medium");
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", 550)
                .attr("y", 530)
                .text(buildHouse)
                .attr("fill", "black")
                .attr("font-size", "medium");

            // button to buy
            var buyButton = g.append("g").attr("id", "build-button");
            buyButton.append("rect")
                .attr("x", 300)
                .attr("y", 540)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
            buyButton.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 350)
                .attr("y", 565)
                .text("Buduj")
                .attr("fill", "black")
                .attr("font-size", "medium");

            // button to sell
            var sellButton = g.append("g").attr("id", "sell-button");
            sellButton.append("rect")
                    .attr("x", 440)
                    .attr("y", 540)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("width", 100)
                    .attr("height", 40)
                    .attr("fill", "white")
                    .attr("stroke", "black")
            sellButton.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 490)
                .attr("y", 565)
                .text("Sprzedaj")
                .attr("fill", "black")
                .attr("font-size", "medium");

            // button to mortgage
            var mortgageButton = g.append("g").attr("id", "mortgage-button");
            mortgageButton.append("rect")
                .attr("x", 300)
                .attr("y", 595)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
            mortgageButton.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 350)
                .attr("y", 620)
                .text("Zastaw")
                .attr("fill", "black")
                .attr("font-size", "medium");

            // button to unmortgage
            var unmortgageButton = g.append("g").attr("id", "unmortgage-button");
            unmortgageButton.append("rect")
                .attr("x", 440)
                .attr("y", 595)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 100)
                .attr("height", 40)
                .attr("fill", "white")
                .attr("stroke", "black")
            unmortgageButton.append("text")
                .attr("text-anchor", "middle")
                .attr("x", 490)
                .attr("y", 620)
                .text("Wykup")
                .attr("fill", "black")
                .attr("font-size", "medium");
        }

        /**
         * Adds pawn to a player.
         * @param pawnName pawn's name
         * @param color pawn's color
         */
        addPawn(pawnName: string, color: string): void {
            this.pawns[pawnName] = new Pawn(this.fields[0], color);
        }

        /**
         * Removes a pawn
         * @param pawnName pawn's name
         */
        removePawn(pawnName: string): void {
            delete this.pawns[pawnName];
        }

        /**
         * Moves chosen pawn on chosen field.
         * @param pawnName pawn's name
         * @param fieldNumber field's number
         * @param onMovingEnd callbac after moving
         * @param forward check if move is forward or backward
         */
        movePawn(pawnName: string, fieldNumber: number, onMovingEnd: () => any, forward: boolean): void {
            let sequencenumber = 0;
            const step = forward ? 1 : -1;

            for (let i = this.pawns[pawnName].getPawnField().getFieldId();
                i != fieldNumber;
                )
            {
                i += step;
                if(i >= 40)
                    i -= 40;
                else if(i < 0)
                    i += 40;
                this.pawns[pawnName].move(this.fields[i], sequencenumber++);
            }
            setTimeout(onMovingEnd, sequencenumber*200);
        }

        /**
         * Returns chosen field.
         * @param fieldNumber field's number
         */
        getField(fieldNumber: number): Field {
            return this.fields[fieldNumber];
        }
    }
}
