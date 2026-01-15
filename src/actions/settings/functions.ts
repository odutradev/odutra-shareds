import api from '@utils/functions/api';

export const getCollectionCount = async (collection: string): Promise<number> => {
  try {
    const response = await api.get(`/kv/${collection}/get-all?pagination=false`);
    const data = response.data?.result || response.data?.data || [];
    return Array.isArray(data) ? data.length : 0;
  } catch { return 0; }
};

export const calculateTotalTime = async (): Promise<number> => {
  try {
    const response = await api.get('/kv/analytics_time/get-all?pagination=false');
    const data = response.data?.result || response.data?.data || [];
    if (!Array.isArray(data)) return 0;
    return data.reduce((acc: number, item: any) => {
      const time = Number(item.data?.timeSpent || item.timeSpent);
      return acc + (isNaN(time) ? 0 : time);
    }, 0);
  } catch { return 0; }
};

export const generateBackupFile = (data: Record<string, any[]>) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-odutra-presentation-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const parseRestoreFile = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const collections = ['shareds', 'analytics_views', 'analytics_time'];
  const hasValidData = collections.some(col => Array.isArray(data[col]) && data[col].length > 0);
  if (!hasValidData) throw new Error("O arquivo não contém dados válidos ou está vazio.");
  return { data, collections };
};