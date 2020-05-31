"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("/login", "UsersController.login");

Route.resource("users", "UsersController")
  .apiOnly()
  .except(["show"])
  .validator(new Map([[["users.store"], ["StoreUser"]]]));

Route.resource("tweets", "TweetsController")
  .apiOnly()
  .except(["update", "show"])
  .middleware(["auth"]);

Route.resource("comments", "CommentsController")
  .apiOnly()
  .except(["update", "show"])
  .middleware(["auth"]);

Route.post("/authenticate", "AuthController.authenticate").middleware(["auth"]);
Route.get("/getUsers/:page", "UsersController.getUsers").middleware(["auth"]);
Route.get(
  "/getAllComments/:tweet_id",
  "TweetsController.getAllComments"
).middleware(["auth"]);

Route.post("/like", "TweetsController.like");
Route.get("/global", "TweetsController.globalTweets");
