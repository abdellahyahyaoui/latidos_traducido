export function splitContentIntoPages(content, maxParagraphsPerPage = 5) {
  const pages = []
  let currentPage = []

  for (const paragraph of content) {
    currentPage.push(paragraph)
    if (currentPage.length >= maxParagraphsPerPage) {
      pages.push(currentPage)
      currentPage = []
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

export function splitPrologoIntoPages(content, maxParagraphsPerPage = 15) {
  const pages = []
  let currentPage = []
  let isFirstPage = true

  for (const paragraph of content) {
    currentPage.push(paragraph)
    const maxForThisPage = isFirstPage ? 10 : maxParagraphsPerPage

    if (currentPage.length >= maxForThisPage) {
      pages.push(currentPage)
      currentPage = []
      isFirstPage = false
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

export function splitRelatoIntoPages(content, maxParagraphsPerPage = 9) {
  const pages = []
  let currentPage = []
  let isFirstPage = true

  for (const paragraph of content) {
    currentPage.push(paragraph)
    const maxForThisPage = isFirstPage ? 8 : maxParagraphsPerPage

    if (currentPage.length >= maxForThisPage) {
      pages.push(currentPage)
      currentPage = []
      isFirstPage = false
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

// Función modificada para recibir parámetros separados para primera página y páginas normales
export function splitRelatoWithPartsIntoPages(parts, maxParagraphsPerPage = 9, firstPageMax = 8) {
  const allPages = []

  // Validar que parts sea un array
  if (!parts || !Array.isArray(parts)) {
    console.error("❌ Parts no es un array válido:", parts)
    return [
      {
        content: ["Error: Contenido no disponible"],
        sectionTitle: "Error",
        isFirstPageOfSection: true,
      },
    ]
  }

  for (const part of parts) {
    // Validar que cada part tenga la estructura correcta
    if (!part || !part.content || !Array.isArray(part.content)) {
      console.error("❌ Part con estructura incorrecta:", part)
      continue
    }

    const { title, content } = part
    let currentPage = []
    let isFirstPageOfSection = true

    for (const paragraph of content) {
      currentPage.push(paragraph)
      // Usar el parámetro específico para la primera página
      const maxForThisPage = isFirstPageOfSection ? firstPageMax : maxParagraphsPerPage

      while (currentPage.length >= maxForThisPage) {
        allPages.push({
          content: currentPage,
          sectionTitle: isFirstPageOfSection ? title : null,
          isFirstPageOfSection: isFirstPageOfSection,
        })
        currentPage = []
        isFirstPageOfSection = false
      }
    }

    if (currentPage.length > 0) {
      allPages.push({
        content: currentPage,
        sectionTitle: isFirstPageOfSection ? title : null,
        isFirstPageOfSection: isFirstPageOfSection,
      })
    }
  }

  // Si no se generaron páginas, crear una página de error
  if (allPages.length === 0) {
    allPages.push({
      content: ["Error: No se pudo procesar el contenido"],
      sectionTitle: "Error",
      isFirstPageOfSection: true,
    })
  }

  console.log(`📄 Páginas generadas: ${allPages.length}`)
  allPages.forEach((page, index) => {
    console.log(`Página ${index + 1}: ${page.content.length} líneas`)
  })

  return allPages
}
