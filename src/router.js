const routes = {}

export function registerRoute(path, handler) {
  routes[path] = handler
}

export function navigate(path) {
  history.pushState({}, "", path)
  runRoute()
}

export function runRoute() {
  const path = window.location.pathname
  const handler = routes[path] || routes["/"]

  if (handler) handler()
}

export function startRouter() {
  window.addEventListener("popstate", runRoute)

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a")

    if (!link) return

    if (link.origin === window.location.origin) {
      e.preventDefault()
      navigate(link.pathname)
    }
  })

  runRoute()
}