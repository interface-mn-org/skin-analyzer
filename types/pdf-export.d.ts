/** Optional PDF export: install html2canvas and jspdf for Save PDF to work. */
declare module 'html2canvas' {
  function html2canvas(
    element: HTMLElement,
    options?: Record<string, unknown>,
  ): Promise<HTMLCanvasElement>
  export default html2canvas
}

declare module 'jspdf' {
  class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string)
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ): void
    save(filename: string): void
  }
  export default jsPDF
}
