"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Interaction extends Model {
  comments() {
    return this.hasMany("App/Models/Comment");
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  tweet() {
    return this.belongsTo("App/Models/Tweet");
  }
}

module.exports = Interaction;
