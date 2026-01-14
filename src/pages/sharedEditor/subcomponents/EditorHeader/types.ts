export interface EditorHeaderProps {
  isEditMode: boolean;
  loading: boolean;
  isFormValid: boolean;
  onSave: () => void;
}