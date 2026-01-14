export interface GeneralSettingsProps {
  title: string;
  slug: string;
  slugError: string;
  checkingSlug: boolean;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onGenerateSlug: () => void;
}