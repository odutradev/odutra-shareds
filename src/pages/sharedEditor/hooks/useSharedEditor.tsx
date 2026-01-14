import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getSharedStats } from '@actions/analytics';
import { checkIdAvailable, createShared, updateShared, getShared } from '@actions/shareds';
import useAction from '@hooks/useAction';

import type { SharedAnalytics } from '@actions/analytics/types';
import type { CreateSharedData } from '@actions/shareds/types';
import type { SharedEditorState, SharedEditorActions, EditorTab } from '../types';

export const useSharedEditor = (): SharedEditorState & SharedEditorActions => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('slug');

  const [formData, setFormData] = useState<CreateSharedData>({
    slug: '',
    title: '',
    html: '',
    css: '',
    js: '',
    isActive: true,
    isRedirect: false,
    redirectUrl: ''
  });

  const [sharedId, setSharedId] = useState<string | null>(null);
  const [slugError, setSlugError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editSlug);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [activeEditor, setActiveEditor] = useState<EditorTab>('html');
  const [stats, setStats] = useState<SharedAnalytics | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const loadStats = useCallback(async (slug: string) => {
    setLoadingStats(true);
    try {
      const result = await getSharedStats(slug);
      if (result && !('error' in result)) setStats(result);
    } catch (e) {
      console.error("Failed to load stats", e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadShared = useCallback(async (slug: string) => {
    setInitialLoading(true);
    try {
      const result = await getShared(slug);
      if (result && !('error' in result)) {
        setFormData({
          slug: result.slug,
          title: result.title,
          html: result.html,
          css: result.css || '',
          js: result.js || '',
          isActive: result.isActive,
          isRedirect: result.isRedirect || false,
          redirectUrl: result.redirectUrl || ''
        });
        setSharedId(result._id);
        loadStats(result.slug);
      } else {
        navigate('/dashboard/projects');
      }
    } catch {
      navigate('/dashboard/projects');
    } finally {
      setInitialLoading(false);
    }
  }, [navigate, loadStats]);

  useEffect(() => {
    if (editSlug) loadShared(editSlug);
  }, [editSlug, loadShared]);

  useEffect(() => {
    const currentSlug = formData.slug;
    if (!currentSlug || (editSlug && currentSlug === editSlug)) {
      setSlugError('');
      setCheckingSlug(false);
      return;
    }

    setSlugError('');
    setCheckingSlug(true);

    const timer = setTimeout(async () => {
      try {
        const available = await checkIdAvailable(currentSlug);
        setSlugError(available ? '' : 'Slug já está em uso');
      } catch {
        setSlugError('');
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.slug, editSlug]);

  const handleSlugChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setFormData((prev) => ({ ...prev, slug: normalized }));
  };

  const generateRandomSlug = () => {
    handleSlugChange(Math.random().toString(36).substring(2, 10));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) return;
    if (!formData.isRedirect && !formData.html) return;
    if (formData.isRedirect && !formData.redirectUrl) return;
    if (slugError || checkingSlug) return;

    setLoading(true);
    try {
      const action = sharedId 
        ? () => updateShared(sharedId, formData) 
        : () => createShared(formData);

      await useAction({
        action,
        callback: () => navigate('/dashboard/projects'),
        toastMessages: {
          pending: sharedId ? 'Salvando alterações...' : 'Criando compartilhamento...',
          success: sharedId ? 'Compartilhamento atualizado!' : 'Compartilhamento criado!',
          error: 'Erro ao salvar compartilhamento',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    sharedId,
    slugError,
    loading,
    initialLoading,
    checkingSlug,
    activeEditor,
    stats,
    loadingStats,
    setFormData,
    handleSlugChange,
    generateRandomSlug,
    handleSubmit,
    setActiveEditor,
    refreshStats: () => formData.slug && loadStats(formData.slug)
  };
};
