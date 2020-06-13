"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InteractionSchema extends Schema {
  up() {
    this.create("interactions", (table) => {
      table.increments();
      table.boolean("tweet_like").defaultTo(false);
      table.integer("tweet_id").unsigned();
      table.integer("user_id").unsigned();

      table.foreign("tweet_id").references("id").inTable("tweets");
      table.foreign("user_id").references("id").inTable("users");

      table.timestamps();
    });
  }

  down() {
    this.drop("interactions");
  }
}

module.exports = InteractionSchema;
