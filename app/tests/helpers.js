import express from 'express'

/**
 * returns a user and express app where the user is authenticated
 *
 * @param {object} userModel new or existing user to create mock session for
 * @return {promise<object>}
 */
export const createUserSession = async function(userModel) {
  const app = require('../../config/express')
  const User = require('../models/user.server.model').default
  require('../../config/passport')()

  const user = userModel._id ?
    userModel :
    await new User(userModel).save()

  const mockApp = express()
  mockApp.all('*', mockSessionMiddleware(user._id))
  mockApp.use(app())

  return {
    user,
    app: mockApp
  }
}

export const initApp = function() {
  const app = require('../../config/express')
  // const User = require('../models/user.server.model').default
  require('../../config/passport')()
  return app
}

/**
 * create a user model
 *
 * @param {string} username
 * @param {string} accountType
 * @param {object} props additional properties to set
 * @return {object}
 */
export const createTestUser = (username, accountType, props = null) => ({
  username,
  firstName: username,
  lastName: 'test',
  accountType: [accountType],
  email: `${username}@test.com`,
  password: 'password',
  provider: 'local',
  ...props
})

function mockSessionMiddleware(userId) {
  return (req, res, next) => {
    req.session = {
      passport: {user: userId}
    }

    next()
  }
}
