import { renderHook, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLastPath } from '../use-last-path';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
}));


describe('useLastPath', () => {
  const mockUsePathname = vi.mocked(usePathname);
  
  // Mock sessionStorage
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Clear all mocks and session storage before each test
    vi.clearAllMocks();
    sessionStorageMock.clear();
    
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  it('should return null initially', () => {
    mockUsePathname.mockReturnValue('/initial');
    
    const { result } = renderHook(() => useLastPath());
    
    expect(result.current).toBeNull();
  });

  it('should store the previous path when pathname changes', () => {
    // First render with initial path
    mockUsePathname.mockReturnValue('/first');
    const { result, rerender } = renderHook(() => useLastPath());
    
    // Change pathname
    mockUsePathname.mockReturnValue('/second');
    act(() => {
      rerender({});
    });
    
    // Should return the previous path
    expect(result.current).toBe('/first');
    
    // Change pathname again
    mockUsePathname.mockReturnValue('/third');
    act(() => {
      rerender({});
    });
    
    // Should return the new previous path
    expect(result.current).toBe('/second');
  });

  it('should persist the last path in sessionStorage', () => {
    // First render with initial path
    mockUsePathname.mockReturnValue('/first');
    const { rerender } = renderHook(() => useLastPath());
    
    // Change pathname
    mockUsePathname.mockReturnValue('/second');
    act(() => {
      rerender({});
    });
    
    // Check if sessionStorage was updated
    expect(sessionStorage.getItem('lastPath')).toBe('/first');
  });

  it('should load the last path from sessionStorage on mount', () => {
    // Set up sessionStorage before the hook mounts
    sessionStorage.setItem('lastPath', '/from-storage');
    
    // Initial render should use the value from sessionStorage
    mockUsePathname.mockReturnValue('/initial');
    const { result } = renderHook(() => useLastPath());
    
    expect(result.current).toBe('/from-storage');
  });

  it('should handle sessionStorage errors gracefully', () => {
    // Force sessionStorage.setItem to throw an error
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });
    
    // Mock console.warn to check if it's called
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // First render with initial path
    mockUsePathname.mockReturnValue('/first');
    const { rerender } = renderHook(() => useLastPath());
    
    // Change pathname - should not throw
    mockUsePathname.mockReturnValue('/second');
    expect(() => {
      act(() => {
        rerender({});
      });
    }).not.toThrow();
    
    // Verify warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to update last path in sessionStorage',
      expect.any(Error)
    );
    
    // Clean up
    sessionStorage.setItem = originalSetItem;
    consoleWarnSpy.mockRestore();
  });
});
