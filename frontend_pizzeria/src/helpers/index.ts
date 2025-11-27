function getTokenFromLocalStorage() {
  const tokenAuth = localStorage.getItem('token') || ''
  if (!tokenAuth) return null

  const jwtPayload = parseJwt(tokenAuth)
  const isExpired = jwtPayload.exp < Date.now() / 1000

  if (!isExpired) return tokenAuth
  else return null
}

function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  if (!base64Url) return { exp: 0 }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(''),
  )

  return JSON.parse(jsonPayload)
}

export { getTokenFromLocalStorage, parseJwt }
