"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const Tweet = use("App/Models/Tweet");

const Database = use("Database");

const { broadcast } = require("../../utils/socket.util");

/**
 * Resourceful controller for interacting with tweets
 */
class TweetsController {
  /**
   * Show a list of all tweets.
   * GET tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view, auth }) {
    let user = await User.find(auth.user.id);

    const tweets = await user.tweets().orderBy("created_at", "desc").fetch();

    user.password = undefined;
    user.updated_at = undefined;

    return { user, tweets };
  }

  /**
   * Create/save a new tweet.
   * POST tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { post } = request.only(["post"]);

    let user = await User.findOrFail(auth.user.id);

    let tweet = new Tweet();
    tweet.post = post;

    await user.tweets().save(tweet);

    user.password = undefined;
    tweet.user = user;

    broadcast("newTweet", tweet);

    return tweet;
  }

  /**
   * Display a single tweet.
   * GET tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async globalTweets() {
    const tweets = await Database.table("tweets")
      .innerJoin("users", "tweets.user_id", "users.id")
      .orderBy("created_at", "desc")
      .limit(10)
      .select(["tweets.*", Database.raw("to_json(users.*) as user")]);

    return tweets;
  }

  /**
   * Update tweet details.
   * PUT or PATCH tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  async like({ request }) {
    const { tweet_id, action } = request.body;

    const tweet = await Tweet.find(tweet_id);

    if (action) {
      tweet.likes++;
    } else {
      if (tweet.likes > 0) tweet.likes--;
    }

    tweet.save();

    return tweet;
  }

  /**
   * Delete a tweet with id.
   * DELETE tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = TweetsController;
