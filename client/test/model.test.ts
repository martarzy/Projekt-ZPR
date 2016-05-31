/// <reference path="../src/model/round.ts" />
/// <reference path="../src/model/player.ts" />
/// <reference path="../src/model/field.ts" />
/// <reference path="qunit.d.ts" />

test("round test", function () {
    let round = new model.Round();
    deepEqual(round.movementPerformed, false);
    round.playerMoved();
    deepEqual(round.movementPerformed, true);
    round.reset();
    deepEqual(round.movementPerformed, false);
});

test("player test", function () {
    let player = new model.Player("Tester", "red");
    deepEqual(player.username, "Tester");
    deepEqual(player.cash, 0);
    deepEqual(player.color, "red");
    player.setCash(1000);
    deepEqual(player.cash, 1000);
});

test("buyable field test", function () {
    let field = new model.Field(0, "Red", 500, 100);
    deepEqual(field.id, 0);
    deepEqual(field.group, "Red");
    deepEqual(field.cost, 500);
    deepEqual(field.isBuyable, true);
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.ownerUsername(), "Tester");
});

test("not buyable field test", function () {
    let field = new model.Field(0, "My test field", 500);
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.ownerUsername(), "");
});