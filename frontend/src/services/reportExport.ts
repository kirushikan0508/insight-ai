import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Capture a DOM element as a high-resolution canvas
 */
export async function captureReportAsCanvas(
  element: HTMLElement,
  scale = 3
): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#0B1020',
    logging: false,
    width: 1600, // force width for export
    height: element.scrollHeight,
    windowWidth: 1600,
  })
  return canvas
}

/**
 * Download canvas as PNG
 */
export function downloadAsPNG(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png', 1.0)
}

/**
 * Download canvas as JPG
 */
export function downloadAsJPG(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/jpeg', 0.95)
}

/**
 * Download canvas as PDF (A4 format, Landscape)
 */
export function downloadAsPDF(canvas: HTMLCanvasElement, filename: string) {
  const imgData = canvas.toDataURL('image/png', 1.0)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // If image fits in one page
  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  } else {
    // Multi-page: split the canvas
    let y = 0
    while (y < imgHeight) {
      if (y > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight)
      y += pageHeight
    }
  }

  pdf.save(`${filename}.pdf`)
}
