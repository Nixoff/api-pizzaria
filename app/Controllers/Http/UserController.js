'use strict'

const User = use('App/Models/User');
const { validateAll } = use('Validator');

class UserController {
  async create({ request, response }) {
    try {

      const erroMessage = {
        'username.required': 'Esse campo é obrigatorio.',
        'username.unique': 'Esse usuário já existe.',
        'username.min': 'O username deve conter mais que 5 caracteres',
        'email.required': 'Esse campo é obrigatorio.',
        'email.unique': 'Esse email já existe.',
        'password.required': 'Esse campo é obrigatorio.',
        'password.min': 'O password deve conter no mínimo 6 caracteres'
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        email: 'required|email|unique:users',
        password: 'required|min:6'
      }, erroMessage)

      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }

      const data = request.only(["username", "email", "password"])

      const user = await User.create(data)

      return user
    } catch (err) {
      return response.status(500).send({ error: `Erro: ${err.message}`})
    }

  }
}

module.exports = UserController
