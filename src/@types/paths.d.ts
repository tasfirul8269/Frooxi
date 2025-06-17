declare module '@/components/*' {
  import type { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/components/ui/*' {
  import type { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/lib/*' {
  const value: any;
  export default value;
}

declare module '@/components/icons' {
  export const Icons: any;
  export default Icons;
}
