const bcrypt = require('bcryptjs')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(userName , password) {
  //logger.debug(`auth.service - login with userName: ${userName}`)
  if (!userName || !password) return Promise.reject('userName and password are required!')
  const user = await userService.getByEmail(userName)
  if (!user) return Promise.reject('Invalid userName or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid userName or password')
  delete user.password;
  return user;
}



async function signup(userName, password, fullName , imgUrl) {
  // logger.debug(`auth.service - signup with userName: ${userName}, fullName: ${fullName}`)
  if (!userName || !password || !fullName) return Promise.reject('userName, fullName and password are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ userName, password: hash, fullName , imgUrl })
}

module.exports = {
  signup,
  login,
}