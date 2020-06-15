"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tweet = use("App/Models/Tweet");
const Comment = use("App/Models/Comment");
const Interaction = use("App/Models/Interaction");

/**
 * Resourceful controller for interacting with comments
 */
class CommentsController {
  /**
   * Show a list of all comments.
   * GET comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new comment.
   * GET comments/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    try {
      const { tweet_id, comment } = request.body;

      if (!tweet_id)
        response.status(401).json({ error: "Params tweet_id required." });

      if (!comment)
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

      let new_comment = new Comment();
      new_comment.comment = comment;

      await interaction.comments().save(new_comment);

      const user = await interaction
        .user()
        .select("name", "username", "email", "id")
        .fetch();

      new_comment.name = user.name;
      new_comment.username = user.username;
      new_comment.email = user.email;
      new_comment.user_id = user.id;
      new_comment.interaction_id = interaction.id;

      return new_comment;
    } catch (err) {
      console.log({ err });
      return err;
    }
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing comment.
   * GET comments/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = CommentsController;
