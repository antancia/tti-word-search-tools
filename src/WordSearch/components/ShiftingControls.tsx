import React from 'react';
import { Disclosure, Separator } from '@heroui/react';
import { useWordSearchControls } from '../WordSearchControlsContext';
import { ControlPanelHeader } from './ControlPanelHeader';

export const ShiftingControls: React.FC = () => {
  const {
    shiftRowsUp,
    shiftRowsDown,
    shiftColsLeft,
    shiftColsRight,
    showGridAxes,
    setShowGridAxes,
    setManualHighlights,
    setColorGroupRotations,
    showUnscrambledGrid,
    setShowUnscrambledGrid,
  } = useWordSearchControls();

  return (
    <div className='controls-box'>
      <Disclosure id='shifting-controls' aria-label='Miscellaneous controls'>
        <Disclosure.Heading>
          <ControlPanelHeader title='Miscellaneous controls' />
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Separator className='mb-3' />
            <div className='px-5 shifting-controls-content'>
              <div className='shifting-shift-all-row'>
                <div className='shifting-shift-all-group'>
                  <span className='shifting-shift-all-label'>All rows</span>
                  <div className='shifting-shift-btns'>
                    <button
                      type='button'
                      className='grid-shift-btn'
                      onClick={shiftRowsUp}
                      title='Shift all rows up'
                      aria-label='Shift all rows up'
                    >
                      ↑
                    </button>
                    <button
                      type='button'
                      className='grid-shift-btn'
                      onClick={shiftRowsDown}
                      title='Shift all rows down'
                      aria-label='Shift all rows down'
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <div className='shifting-shift-all-group'>
                  <span className='shifting-shift-all-label'>All cols</span>
                  <div className='shifting-shift-btns'>
                    <button
                      type='button'
                      className='grid-shift-btn'
                      onClick={shiftColsLeft}
                      title='Shift all columns left'
                      aria-label='Shift all columns left'
                    >
                      ←
                    </button>
                    <button
                      type='button'
                      className='grid-shift-btn'
                      onClick={shiftColsRight}
                      title='Shift all columns right'
                      aria-label='Shift all columns right'
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
              <label className='shifting-axes-label'>
                <input
                  type='checkbox'
                  checked={showGridAxes}
                  onChange={(e) => setShowGridAxes(e.target.checked)}
                  aria-label='Show row and column axes'
                />
                <span>Show axes</span>
              </label>
              <button
                type='button'
                className='shifting-clear-btn'
                onClick={() => {
                  setManualHighlights({});
                  setColorGroupRotations(new Array(6).fill(0));
                }}
                title='Clear all manual highlights'
                aria-label='Clear all manual highlights'
              >
                Clear highlights
              </button>
              <label className='shifting-axes-label'>
                <input
                  type='checkbox'
                  checked={showUnscrambledGrid}
                  onChange={(e) => setShowUnscrambledGrid(e.target.checked)}
                  aria-label='Show unscrambled grid'
                />
                <span>Unscramble</span>
              </label>
            </div>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
};
