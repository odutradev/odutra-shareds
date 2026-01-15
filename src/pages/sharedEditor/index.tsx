import { Stack } from '@mui/material';

import Loading from '@components/loading';
import type { CreateSharedData } from '@actions/shareds/types';

import EditorHeader from './subcomponents/EditorHeader';
import MetricsDashboard from './subcomponents/MetricsDashboard';
import GeneralSettings from './subcomponents/GeneralSettings';
import VisibilityControl from './subcomponents/VisibilityControl';
import RedirectControl from './subcomponents/RedirectControl';
import CodeWorkspace from './subcomponents/CodeWorkspace';

import { useSharedEditor } from './hooks/useSharedEditor';
import { ContentArea, EditorContainer, EditorPaper, PageContainer } from './styles';
import type { EditorTab } from './types';

const SharedEditor = () => {
  const {
    formData, sharedId, slugError, loading, initialLoading, checkingSlug,
    activeEditor, stats, loadingStats, setFormData, handleSlugChange,
    generateRandomSlug, handleSubmit, setActiveEditor, refreshStats
  } = useSharedEditor();

  if (initialLoading) return <Loading message="Carregando editor..." />;

  const isFormValid = !!formData.title && !!formData.slug && !slugError && !checkingSlug && !loading && 
    (formData.isRedirect ? !!formData.redirectUrl : !!formData.html);

  return (
    <PageContainer>
      <EditorContainer>
        <EditorPaper elevation={0}>
          <EditorHeader
            isEditMode={!!sharedId}
            loading={loading}
            isFormValid={isFormValid}
            onSave={handleSubmit}
          />
          <ContentArea>
            <Stack spacing={3}>
              {sharedId && <MetricsDashboard stats={stats} loading={loadingStats} onRefresh={refreshStats} />}
              
              <GeneralSettings
                title={formData.title}
                slug={formData.slug}
                slugError={slugError}
                checkingSlug={checkingSlug}
                onTitleChange={(v) => setFormData((prev: CreateSharedData) => ({ ...prev, title: v }))}
                onSlugChange={handleSlugChange}
                onGenerateSlug={generateRandomSlug}
              />

              <VisibilityControl
                isActive={formData.isActive}
                slug={formData.slug}
                onChange={(v) => setFormData((prev: CreateSharedData) => ({ ...prev, isActive: v }))}
              />

              <RedirectControl
                isRedirect={formData.isRedirect || false}
                redirectUrl={formData.redirectUrl || ''}
                onChangeRedirect={(v) => setFormData((prev: CreateSharedData) => ({ ...prev, isRedirect: v }))}
                onChangeUrl={(v) => setFormData((prev: CreateSharedData) => ({ ...prev, redirectUrl: v }))}
              />

              {!formData.isRedirect && (
                <CodeWorkspace
                  html={formData.html}
                  css={formData.css || ''}
                  js={formData.js || ''}
                  activeEditor={activeEditor}
                  onTabChange={setActiveEditor}
                  onCodeChange={(tab: EditorTab, val: string) => setFormData((prev: CreateSharedData) => ({ ...prev, [tab]: val }))}
                />
              )}
            </Stack>
          </ContentArea>
        </EditorPaper>
      </EditorContainer>
    </PageContainer>
  );
};

export default SharedEditor;