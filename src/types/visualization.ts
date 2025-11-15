export interface VisualizationState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export interface VisualizationConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<any>;
  route: string;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface ResponsiveConfig {
  breakpoint: number;
  width: number;
  height: number;
}