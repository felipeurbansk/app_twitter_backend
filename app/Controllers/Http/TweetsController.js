"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const Tweet = use("App/Models/Tweet");
const Interaction = use("App/Models/Interaction");
const Comment = use("App/Models/Comment");

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
    const page = 1;

    const tweets = await Database.table("tweets")
      .innerJoin("users", "tweets.user_id", "users.id")
      // .leftJoin("comments", "tweets.id", "comments.tweet_id")
      .orderBy("created_at", "desc")
      .limit(10)
      .select([
        "tweets.*",
        Database.raw("to_json(users.*) as user"),
        // Database.raw("to_json(comments.*) as comments"),
      ]);

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

  /**
   * Create/Update tweet_like.
   * PUT or PATCH tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async like({ request, auth, response }) {
    try {
      const { tweet_id } = request.params;
      const tweet = await Tweet.find(tweet_id);

      if (!tweet) return { error: "Tweet not found." };

      const interactions_user = await tweet
        .interactions()
        .where("user_id", auth.user.id)
        .select("*")
        .first();

      if (interactions_user) {
        await tweet
          .interactions()
          .where("user_id", auth.user.id)
          .where("id", interactions_user.id)
          .update({ tweet_like: !interactions_user.tweet_like })
          .returning("id");
        return { success: "Updated success." };
      } else {
        const interaction = new Interaction();

        interaction.tweet_like = true;
        interaction.user_id = auth.user.id;

        tweet.interactions().save(interaction);
        return { success: "Interect created success." };
      }
    } catch (err) {
      return response
        .status(401)
        .json({ error: "Liked function does not work." });
    }
  }

  /**
   * Create/Update comments.
   * PUT or PATCH tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async create_comment({ request, auth, response }) {
    try {
      const { tweet_id } = request.params;
      const { comment_user } = request.body;

      if (!tweet_id)
        response.status(401).json({ error: "Params tweet_id required." });

      if (!comment_user)
        response.status(401).json({ error: "Body comment_user required." });

      const tweet = await Tweet.find(tweet_id);

      if (!tweet)
        return response.status(404).json({ error: "Tweet not found." });

      let interaction = await tweet
        .interactions()
        .where("user_id", auth.user.id)
        .where("tweet_id", tweet_id)
        .first();

      if (!interaction) {
        interaction = new Interaction();
        interaction.user_id = auth.user.id;
        await tweet.interactions().save(interaction);
      }

      let comment = new Comment();
      comment.comment = comment_user;

      comment = await interaction.comments().save(comment);

      return comment;
    } catch (err) {
      console.log({ err });
      return err;
    }
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

  async getAllComments({ request }) {
    try {
      const { tweet_id } = request.params;
      if (!tweet_id) return { error: "Params tweet_id not found." };

      let tweet = await Tweet.findOrFail(tweet_id);
      let user = await tweet.user().fetch();
      let likes = await tweet
        .interactions()
        .where("tweet_like", true)
        .select("*")
        .fetch();

      const { rows } = await Database.raw(
        `
        SELECT comments.*, users.id as user_id, users.username, users.name, users.email FROM tweets AS tweet
        INNER JOIN interactions AS interaction
        ON tweet.id = interaction.tweet_id
        INNER JOIN comments
        ON comments.interaction_id = interaction.id
        INNER JOIN users as users
        ON users.id = interaction.user_id
        WHERE tweet.id = ${tweet_id}
        `
      );

      return { user, tweet, likes, comments: rows };
      /** Precisa retornar users, tweet, comments / tweet.comments */
    } catch (err) {
      console.log({ err });
      return err;
    }
    return { tweet, user };
  }
}

module.exports = TweetsController;
