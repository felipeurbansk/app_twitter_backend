"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Comment extends Model {
  /**
   * A relationship on tweet the comments
   *
   * @method tweet
   *
   * @return {Object}
   */
  tweet() {
    return this.belongsTo("App/Models/Tweet");
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  interaction() {
    return this.belongsTo("App/Models/Interaction");
  }
}

module.exports = Comment;
