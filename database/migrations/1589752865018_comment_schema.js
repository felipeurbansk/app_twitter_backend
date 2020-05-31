"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CommentSchema extends Schema {
  up() {
    this.create("comments", (table) => {
      table.increments();
      table.string("comment");
      table.integer("likes").notNullable().defaultTo(0);
      table.integer("tweet_id").unsigned();
      table.integer("user_id").unsigned();

      table.foreign("user_id").references("id").inTable("users");
      table.foreign("tweet_id").references("id").inTable("tweets");
      table.timestamps();
    });
  }

  down() {
    this.drop("comments");
  }
}

module.exports = CommentSchema;
