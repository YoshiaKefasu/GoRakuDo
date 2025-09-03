// Global TypeScript declarations for GoRakuDo
declare global {
  interface Window {
    clientLogger: {
      log: (
        message: string,
        level?: 'info' | 'success' | 'warning' | 'error'
      ) => void;
      startGroup: (title: string) => void;
      endGroup: (title: string) => void;
    };
    searchLoadingManager?: any;
    searchEngine?: any;
    contentConfig?: any;
    allPosts?: any[];
    Fuse?: any;
  }
}

export {};
