// colorthief.d.ts

declare module "colorthief" {
  export default class ColorThief {
    getColor(sourceImage: HTMLImageElement, quality?: number): number[];
    getPalette(sourceImage: HTMLImageElement, colorCount?: number, quality?: number): number[][];
  }
}
