'use strict'

class AuthController {

  async authenticate( { auth } ) {

    return { user_id: auth.user.id }

  }

}

module.exports = AuthController
