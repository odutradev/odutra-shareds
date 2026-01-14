export interface VisibilityControlProps {
  isActive: boolean;
  slug: string;
  onChange: (value: boolean) => void;
}