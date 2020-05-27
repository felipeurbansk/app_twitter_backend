'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tweet extends Model {

   /**
   * A relationship on comments the tweet
   *
   * @method comments
   *
   * @return {Object}
   */
  comments() {
    return this.hasMany('App/Models/Comment');
  }

  /**
   * A relationship on users the tweet
   *
   * @method comments
   *
   * @return {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

}

module.exports = Tweet
