import { useState, useCallback } from 'react';
import type { ConfirmOptions, UseConfirmDialogReturn } from './types';

const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [options, setOptions] = useState<ConfirmOptions>({ title: '', message: '' });
  const [open, setOpen] = useState(false);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver.resolve(false);
    }
  }, [resolver]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (resolver) {
      resolver.resolve(true);
    }
  }, [resolver]);

  return {
    confirm,
    props: {
      open,
      onClose: handleClose,
      onConfirm: handleConfirm,
      ...options,
    },
  };
};

export default useConfirmDialog;