"use strict";

class StoreUser {
  get rules() {
    return {
      name: "required|string",
      username: "required|unique:users",
      email: "required|email|unique:users",
      password: "required",
    };
  }

  get messages() {
    return {
      "username.required": "Username é obrigatório",
      "username.unique": "Username já está sendo usado por outra pessoa",
      "email.required": "E-mail é obrigatório",
      "email.email": "E-mail deve ser um endereço válido",
      "email.unique": "E-mail já cadastrado",
      "password.required": "Senha é obrigatório",
    };
  }
}

module.exports = StoreUser;
