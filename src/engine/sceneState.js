let currentPage = null

export function setPage(page) {
  if (currentPage && currentPage.cleanup) {
    currentPage.cleanup()
  }

  currentPage = page

  if (currentPage.init) {
    currentPage.init()
  }
}

export function updatePage(time) {
  if (currentPage && currentPage.update) {
    currentPage.update(time)
  }
}