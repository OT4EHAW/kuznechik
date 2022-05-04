import tokenHelper from "./helper";

const TIMER_SECONDS = 300 //300 seconds = 5 minutes

let userSessionList = []

const getUserSession = (userId) => {
 return  userSessionList.find(session => session.userId === userId)
}

const stopUserSession = (userId) => {
  getUserSession(userId).isAccess = false
}

const deleteUserSession = (userId) => {
  const userSession = getUserSession(userId)
  if (!userSession) {
    return []
  }
  userSessionList = userSessionList.filter(session => session.userId !== userId)
  clearTimeout(userSession.accessTimer);
  clearTimeout(userSession.refreshTimer);
  const invalidRefreshToken = {
    value: userSession.refreshToken,
    isDangerous: false,
  }
  // через 10 секунд считаем отправку использованного refresh-токена УГРОЗОЙ
  setTimeout(()=>{
    invalidRefreshToken.isDangerous = true
  }, 10*1000)
  userSession.invalidRefreshTokenList.push(invalidRefreshToken)
  return userSession.invalidRefreshTokenList;
}

const initUserSession = (userId, refreshToken) =>{
  const invalidRefreshTokenList = deleteUserSession(userId)
  const userSession = {
    userId,
    refreshToken,
    isAccess: true,
    accessTimer: setTimeout(()=>{
      stopUserSession(userId)
    }, TIMER_SECONDS*1000),
    refreshTimer: setTimeout(()=>{
      deleteUserSession(userId)
    }, TIMER_SECONDS*10000),
    invalidRefreshTokenList: [...invalidRefreshTokenList],
  }
  userSessionList.push(userSession)
}


export const createUserToken = (userId) =>{
  const accessToken =  tokenHelper.createAccess(userId, TIMER_SECONDS)
  const refreshToken = tokenHelper.createRefresh()
  initUserSession(userId, refreshToken)
  return  { accessToken, refreshToken }
}

export const checkUserToken = (accessToken) =>{
  console.log("Авторизация")
  if (!accessToken) {
    console.error("accessToken", accessToken)
    return false
  }
  console.log("accessToken", accessToken)
  const userId = tokenHelper.getUser(accessToken)
  if (!userId) {
    console.error("Пользователь не определен")
    return null
  }
  console.log("userId", userId)
  const algName = tokenHelper.getAlg(accessToken)
  if (algName !== tokenHelper.algName) {
    console.error("Неверный алгоритм шифрования")
    return null
  }
  const userSession = getUserSession(userId)
  if (!userSession) {
    console.error("Пользователь не проходил процедуру аутентификации")
    return null
  }
  const realAccessToken = tokenHelper.createAccess(userId, TIMER_SECONDS)
  if (accessToken !== realAccessToken) {
    console.error("Токен доступа не прошел проверку подлинности")
    return false
  }
  if (!userSession.isAccess){
    console.error("Токен доступа уже не действителен")
    return false
  }
  return true
}

export const updateUserToken = (userId, userRefreshToken) =>{
  const userSession = getUserSession(userId)
  console.log("userSession", userSession)
  console.log("allSessions count", userSessionList.length)

  if (!userSession) {
    console.error("Пользователь не проходил процедуру аутентификации")
    return null
  }
  if (userSession.refreshToken !== userRefreshToken) {
    console.error("Токен обновления не прошел проверку подлинности")
    const invalidRefreshToken = userSession.invalidRefreshTokenList.find(refresh => refresh.value === userRefreshToken)
    if (invalidRefreshToken.isDangerous) {
      console.warn("Прислан используемый ранее refresh-токен. Необходима повторная авторизация")
      deleteUserSession(userId)
    }
    return null
  }
  return createUserToken(userId)
}




