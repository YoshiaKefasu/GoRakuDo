// Global TypeScript declarations for GoRakuDo

// Vue Composition API globals for better integration
declare global {
  const defineProps: typeof import('vue')['defineProps'];
  const defineEmits: typeof import('vue')['defineEmits'];
  const ref: typeof import('vue')['ref'];
  const computed: typeof import('vue')['computed'];
  const onMounted: typeof import('vue')['onMounted'];

  interface Window {
    clientLogger?: {
      log: (
        message: string,
        level?: 'info' | 'success' | 'warning' | 'error'
      ) => void;
      startGroup?: (title: string) => void;
      endGroup?: (title: string) => void;
    };
    searchLoadingManager?: {
      isLoading: boolean;
      setLoading: (loading: boolean) => void;
    };
    searchEngine?: {
      search: (query: string) => Promise<unknown[]>;
      filter: (filters: Record<string, unknown>) => unknown[];
    };
    contentConfig?: {
      getCategories: () => unknown[];
      getTags: () => unknown[];
    };
    allPosts?: Array<{
      id: string;
      title: string;
      description: string;
      slug: string;
      data?: {
        title?: string;
        description?: string;
        tags?: string[];
        aiMetadata?: {
          contentType?: 'guide' | 'tool' | 'methodology' | 'practice';
          learningStage?: 'beginner' | 'intermediate' | 'advanced';
          isRecommended?: boolean;
          complexity?: string;
          keywords?: string[];
          semanticKeywords?: string[];
          learningObjectives?: string[];
          learningPath?: string[];
          recommendations?: string[];
        };
      };
    }>;
    Fuse?: {
      search: (query: string) => unknown[];
    };
  }
}

// Vue module declaration for better TypeScript support
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>;
  export default component;
}

export {};
