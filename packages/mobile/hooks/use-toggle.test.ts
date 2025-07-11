/**
 * Tests for useToggle hook
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToggle } from './use-toggle';

describe('useToggle', () => {
  it('should initialize with default state (false)', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current.isOpen).toBe(false);
    expect(typeof result.current.open).toBe('function');
    expect(typeof result.current.close).toBe('function');
    expect(typeof result.current.toggle).toBe('function');
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useToggle(true));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should open when open() is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close when close() is called', () => {
    const { result } = renderHook(() => useToggle(true));
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle state when toggle() is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    // Toggle from false to true
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Toggle from true to false
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should maintain state consistency when calling multiple actions', () => {
    const { result } = renderHook(() => useToggle(false));
    
    // Call open multiple times
    act(() => {
      result.current.open();
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Call close multiple times
    act(() => {
      result.current.close();
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should return stable function references', () => {
    const { result, rerender } = renderHook(() => useToggle(false));
    
    const initialOpen = result.current.open;
    const initialClose = result.current.close;
    const initialToggle = result.current.toggle;
    
    // Trigger a re-render by calling toggle
    act(() => {
      result.current.toggle();
    });
    
    rerender();
    
    // Function references should remain stable
    expect(result.current.open).toBe(initialOpen);
    expect(result.current.close).toBe(initialClose);
    expect(result.current.toggle).toBe(initialToggle);
  });

  it('should handle edge cases correctly', () => {
    const { result } = renderHook(() => useToggle(false));
    
    // Multiple rapid toggles
    act(() => {
      result.current.toggle();
      result.current.toggle();
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Open when already open
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Close when already closed
    act(() => {
      result.current.close();
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should work with different initial states', () => {
    // Test with true initial state
    const { result: resultTrue } = renderHook(() => useToggle(true));
    expect(resultTrue.current.isOpen).toBe(true);
    
    // Test with false initial state
    const { result: resultFalse } = renderHook(() => useToggle(false));
    expect(resultFalse.current.isOpen).toBe(false);
    
    // Test with undefined (should default to false)
    const { result: resultUndefined } = renderHook(() => useToggle());
    expect(resultUndefined.current.isOpen).toBe(false);
  });
});