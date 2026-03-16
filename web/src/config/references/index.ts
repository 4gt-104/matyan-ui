const MATYAN_DOCS_BASE = 'https://4gt-104.github.io/matyan-core';
const MATYAN_REPO = 'https://github.com/4gt-104/matyan-core';

const DOCUMENTATIONS = {
  MAIN_PAGE: MATYAN_REPO,
  STABLE: `${MATYAN_DOCS_BASE}/`,
  MATYAN_QL: `${MATYAN_DOCS_BASE}/using/search/`,
  SUPPORTED_TYPES: `${MATYAN_DOCS_BASE}/quick-start/supported-types/`,
  EXPLORERS: {
    SEARCH: `${MATYAN_DOCS_BASE}/ui/overview/`,

    PARAMS: {
      MAIN: `${MATYAN_DOCS_BASE}/ui/overview/`,
      SEARCH: `${MATYAN_DOCS_BASE}/using/query-runs/`,
    },
    METRICS: {
      MAIN: `${MATYAN_DOCS_BASE}/ui/overview/`,
      SEARCH: `${MATYAN_DOCS_BASE}/using/query-runs/`,
    },
    IMAGES: {
      MAIN: `${MATYAN_DOCS_BASE}/ui/overview/`,
      SEARCH: `${MATYAN_DOCS_BASE}/using/query-runs/`,
    },
    SCATTERS: {
      MAIN: `${MATYAN_DOCS_BASE}/ui/overview/`,
      SEARCH: `${MATYAN_DOCS_BASE}/using/query-runs/`,
    },
    RUNS: {
      MAIN: `${MATYAN_DOCS_BASE}/using/manage-runs/`,
      SEARCH: `${MATYAN_DOCS_BASE}/using/search/`,
    },
  },
  INTEGRATIONS: {
    PYTORCH_LIGHTNING: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    HUGGING_FACE: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    KERAS: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    KERAS_TUNER: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    XGBOOST: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    CATBOOST: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    FASTAI: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    LIGHT_GBM: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
    PYTORCH_IGNITE: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
  },
};

const DEMOS = {
  // No deployed demo yet; redirect to documentation
  MAIN: `${MATYAN_DOCS_BASE}/`,
};

const GUIDES = {
  SETUP: {
    COLAB_EXAMPLE:
      'https://colab.research.google.com/drive/14rIAjpEyklf5fSMiRbyZs6iYG7IVibcI?usp=sharing',
  },
};

const DASHBOARD_PAGE_GUIDES: { name: string; url: string }[] = [
  {
    name: 'UI - Runs Management',
    url: `${MATYAN_DOCS_BASE}/using/manage-runs/`,
  },
  { name: 'UI - Explorers', url: `${MATYAN_DOCS_BASE}/ui/overview/` },
  { name: 'UI - Bookmarks', url: `${MATYAN_DOCS_BASE}/ui/overview/` },
  { name: 'UI - Tags page', url: `${MATYAN_DOCS_BASE}/ui/overview/` },
  { name: 'Manage runs', url: `${MATYAN_DOCS_BASE}/using/manage-runs/` },
  { name: 'Configure runs', url: `${MATYAN_DOCS_BASE}/using/configure-runs/` },
  {
    name: 'Query runs and objects',
    url: `${MATYAN_DOCS_BASE}/using/query-runs/`,
  },
  { name: 'Query language basics', url: `${MATYAN_DOCS_BASE}/using/search/` },
  {
    name: 'Track experiments with remote server',
    url: `${MATYAN_DOCS_BASE}/using/remote-tracking/`,
  },
  {
    name: 'Log messages during training process',
    url: `${MATYAN_DOCS_BASE}/using/logging/`,
  },
  {
    name: 'Host Matyan on Kubernetes (K8s)',
    url: `${MATYAN_DOCS_BASE}/deployment/production/`,
  },
  {
    name: 'Integration guides',
    url: `${MATYAN_DOCS_BASE}/quick-start/integrations/`,
  },
  {
    name: 'Data storage',
    url: `${MATYAN_DOCS_BASE}/understanding/data-storage/`,
  },
  { name: 'Concepts', url: `${MATYAN_DOCS_BASE}/understanding/concepts/` },
];

export { DOCUMENTATIONS, GUIDES, DEMOS, DASHBOARD_PAGE_GUIDES };
