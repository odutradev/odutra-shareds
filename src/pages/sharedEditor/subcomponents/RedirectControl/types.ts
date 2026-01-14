export interface RedirectControlProps {
  isRedirect: boolean;
  redirectUrl: string;
  onChangeRedirect: (value: boolean) => void;
  onChangeUrl: (value: string) => void;
}