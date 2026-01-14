export interface DialogConfig {
  title: string;
  message: string;
  action: () => Promise<void>;
}