declare module 'jspdf' {
  export interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape' | 'p' | 'l';
    unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
    format?: string | number[];
    compress?: boolean;
    precision?: number;
    userUnit?: number;
  }

  export class jsPDF {
    constructor(options?: jsPDFOptions);
    constructor(
      orientation?: 'portrait' | 'landscape' | 'p' | 'l',
      unit?: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc',
      format?: string | number[]
    );

    text(text: string | string[], x: number, y: number, options?: any): jsPDF;
    setFontSize(size: number): jsPDF;
    setFont(fontName: string, fontStyle?: string): jsPDF;
    setTextColor(r: number, g?: number, b?: number): jsPDF;
    setTextColor(color: string): jsPDF;
    addPage(format?: string | number[], orientation?: 'portrait' | 'landscape' | 'p' | 'l'): jsPDF;
    save(filename: string): jsPDF;
    output(type: 'blob'): Blob;
    output(type: 'arraybuffer'): ArrayBuffer;
    output(type: 'datauristring' | 'datauri'): string;
    output(type: string): any;
    setProperties(properties: { title?: string; subject?: string; author?: string; keywords?: string; creator?: string }): jsPDF;

    internal: {
      pageSize: {
        width: number;
        height: number;
        getWidth(): number;
        getHeight(): number;
      };
      getNumberOfPages(): number;
    };

    lastAutoTable?: {
      finalY: number;
    };
  }

  export default jsPDF;
}
