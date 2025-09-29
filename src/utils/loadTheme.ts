const LINK_ELEMENT_ID = "themeSwitcherElement"

export async function loadTheme(url: string): Promise<void> {
  if (!url) {
    throw new Error("Theme URL is required to load a theme.")
  }

  let link = document.getElementById(LINK_ELEMENT_ID) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement("link")
    link.id = LINK_ELEMENT_ID
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }

  link.href = url
}
