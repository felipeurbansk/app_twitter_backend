'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TweetSchema extends Schema {
  up () {
    this.create('tweets', (table) => {
      table.increments()
      table.string('post', 120).notNullable()
      table.integer('likes').notNullable().defaultTo(0)
      table.integer('user_id').unsigned()

      table.foreign('user_id').references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('tweets')
  }
}

module.exports = TweetSchema
