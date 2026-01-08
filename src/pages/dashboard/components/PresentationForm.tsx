import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { Presentation, CreatePresentationData } from '@actions/presentations/types';
import { generateId, isValidId } from '@utils/functions/idGenerator';
import { checkIdAvailable } from '@actions/presentations';

interface PresentationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePresentationData) => void;
  presentation?: Presentation | null;
}

const PresentationForm = ({ open, onClose, onSubmit, presentation }: PresentationFormProps) => {
  const [formData, setFormData] = useState<CreatePresentationData>({
    id: '',
    title: '',
    html: '',
    css: '',
    js: '',
    isActive: true,
  });
  const [idError, setIdError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (presentation) {
      setFormData({
        id: presentation.id,
        title: presentation.title,
        html: presentation.html,
        css: presentation.css || '',
        js: presentation.js || '',
        isActive: presentation.isActive,
      });
    } else {
      handleGenerateId();
    }
  }, [presentation, open]);

  const handleGenerateId = async () => {
    let newId = generateId();
    let available = await checkIdAvailable(newId);
    
    while (available && 'error' in available) {
      newId = generateId();
      available = await checkIdAvailable(newId);
    }

    if (typeof available === 'boolean' && !available) {
      handleGenerateId();
      return;
    }

    setFormData((prev) => ({ ...prev, id: newId }));
    setIdError('');
  };

  const handleIdChange = async (value: string) => {
    const lowercaseValue = value.toLowerCase();
    setFormData((prev) => ({ ...prev, id: lowercaseValue }));

    if (!isValidId(lowercaseValue)) {
      setIdError('ID deve ter exatamente 4 caracteres (letras e números)');
      return;
    }

    if (presentation && lowercaseValue === presentation.id) {
      setIdError('');
      return;
    }

    const available = await checkIdAvailable(lowercaseValue);
    if (typeof available === 'boolean' && !available) {
      setIdError('ID já está em uso');
    } else {
      setIdError('');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.html || !formData.id || idError) {
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      id: '',
      title: '',
      html: '',
      css: '',
      js: '',
      isActive: true,
    });
    setIdError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {presentation ? 'Editar Apresentação' : 'Nova Apresentação'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="ID (4 caracteres)"
              value={formData.id}
              onChange={(e) => handleIdChange(e.target.value)}
              error={!!idError}
              helperText={idError || 'Letras e números apenas'}
              required
              sx={{ flexGrow: 1 }}
              inputProps={{ maxLength: 4 }}
            />
            {!presentation && (
              <Tooltip title="Gerar ID aleatório">
                <IconButton onClick={handleGenerateId} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <TextField
            label="HTML"
            value={formData.html}
            onChange={(e) => setFormData({ ...formData, html: e.target.value })}
            multiline
            rows={6}
            required
            fullWidth
            sx={{ fontFamily: 'monospace' }}
          />

          <TextField
            label="CSS (opcional)"
            value={formData.css}
            onChange={(e) => setFormData({ ...formData, css: e.target.value })}
            multiline
            rows={4}
            fullWidth
            sx={{ fontFamily: 'monospace' }}
          />

          <TextField
            label="JavaScript (opcional)"
            value={formData.js}
            onChange={(e) => setFormData({ ...formData, js: e.target.value })}
            multiline
            rows={4}
            fullWidth
            sx={{ fontFamily: 'monospace' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Apresentação ativa"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title || !formData.html || !formData.id || !!idError || loading}
        >
          {presentation ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PresentationForm;
