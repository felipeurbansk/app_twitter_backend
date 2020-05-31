"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use("App/Models/User");
const Database = use("Database");

class UsersController {
  /**
   * Create/save a new users.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    try {
      const userData = request.only(["name", "username", "email", "password"]);
      const user = await User.create(userData);

      return await auth.generate(user);
    } catch (err) {
      return response.json({
        name: err.name,
        message: err.message,
      });
    }
  }

  async login({ request, auth }) {
    const { email, password } = request.all();

    const login = await auth.attempt(email, password);

    return login;
  }

  async getUsers({ request, auth }) {
    const { page } = request.params;

    return await Database.select("id", "name", "username", "email")
      .table("users")
      .limit(3)
      .offset((page - 1) * 3);
  }
}

module.exports = UsersController;
