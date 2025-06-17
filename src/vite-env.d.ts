/// <reference types="vite/client" />

// Add path aliases for TypeScript
declare module '@/components/*' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/components/ui/*' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/lib/*' {
  const value: any;
  export default value;
}
