/// <reference path="../src/model/round.ts" />
/// <reference path="../src/model/player.ts" />
/// <reference path="../src/model/field.ts" />

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
    let field = new model.Field(0, "My test field", 500, true);
    deepEqual(field.id, 0);
    deepEqual(field.description, "My test field");
    deepEqual(field.cost, 500);
    deepEqual(field.buyable, true);
    deepEqual(field.hasOwner(), false);
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.hasOwner(), true);
    deepEqual(field.ownerUsername(), "Tester");
});

test("not buyable field test", function () {
    let field = new model.Field(0, "My test field", 500, false);
    deepEqual(field.hasOwner(), false);
    deepEqual(field.ownerUsername(), "");
    field.markAsBought("Tester");
    deepEqual(field.hasOwner(), false);
    deepEqual(field.ownerUsername(), "");
});