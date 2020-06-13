"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CommentSchema extends Schema {
  up() {
    this.create("comments", (table) => {
      table.increments();
      table.string("comment", 120).notNullable();
      table.integer("interaction_id").unsigned();

      table.foreign("interaction_id").references("id").inTable("interactions");
      table.timestamps();
    });
  }

  down() {
    this.drop("comments");
  }
}

module.exports = CommentSchema;
