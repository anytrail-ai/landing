import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { renderQuotePdf } from './pdf';
import { sampleQuote } from './sample-quote';

describe('renderQuotePdf', () => {
  it('renders a one-page PDF with Spanish text and typographic characters', async () => {
    const bytes = await renderQuotePdf(sampleQuote());
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getTitle()).toBe('Cotización CEL-260930-ABCD');
  });
});
