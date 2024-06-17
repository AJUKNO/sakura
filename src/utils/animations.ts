export const animations = () => {
  // Get elements
  const elements = document.querySelectorAll('[data-animate]')

  // If elements exist, create an observer
  if (elements.length > 0) {
    const observer = new IntersectionObserver(onIntersection)
    elements.forEach((el) => observer.observe(el))
  }
}

const onIntersection = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => {
  entries.forEach((entry) => {
    const repeat = (entry.target as HTMLElement).hasAttribute('data-animate-repeat')

    if (entry.isIntersecting) {
      setTimeout(() => {
        ;(entry.target as HTMLElement).setAttribute('data-animate-active', '')
      }, 100)
      if (!repeat) observer.unobserve(entry.target)
    } else if (repeat) {
      ;(entry.target as HTMLElement).removeAttribute('data-animate-active')
    }
  })
}
