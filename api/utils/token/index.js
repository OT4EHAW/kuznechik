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
    return
  }
  clearTimeout(userSession.accessTimer);
  clearTimeout(userSession.refreshTimer);
  userSessionList = userSessionList.filter(session => session.userId !== userId)

}

const initUserSession = (userId, refreshToken) =>{
  deleteUserSession(userId)
  userSessionList.push({
    userId,
    refreshToken,
    isAccess: true,
    accessTimer: setTimeout(()=>{
      stopUserSession(userId)
    }, TIMER_SECONDS*1000),
    refreshTimer: setTimeout(()=>{
      deleteUserSession(userId)
    }, TIMER_SECONDS*10000),
  })
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
  console.log("userId", userId)
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
    return null
  }
  return createUserToken(userId)
}




