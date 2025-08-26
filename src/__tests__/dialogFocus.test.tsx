/**
*  © 2025 Nova Bowley. All rights reserved.
*/

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function SampleDialog() {
  return (
    <Dialog>
      <DialogTrigger data-testid="open-btn">Open</DialogTrigger>
      <DialogContent>
  <DialogTitle>Sample</DialogTitle>
  <DialogDescription>Focus trap test.</DialogDescription>
  <button type="button" data-testid="inside-1">One</button>
  <button type="button" data-testid="inside-2">Two</button>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog focus trap', () => {
  it('opens dialog and first button receives focus', async () => {
    render(<SampleDialog />);
    const openBtn = screen.getByTestId('open-btn');
    fireEvent.click(openBtn);
    const one = await screen.findByTestId('inside-1');
    // Radix should focus the first focusable element
    expect(document.activeElement).toBe(one);
  });
});
