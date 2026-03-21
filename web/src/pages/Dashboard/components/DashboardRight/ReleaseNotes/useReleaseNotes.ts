import React from 'react';
import { marked } from 'marked';

import { IReleaseNote } from 'modules/core/api/releaseNotesApi/types';
import { IResourceState } from 'modules/core/utils/createResource';

import createReleaseNotesEngine from './ReleasesStore';

function useReleaseNotes() {
  const { current: releaseNotesEngine } = React.useRef(
    createReleaseNotesEngine,
  );
  const releaseNotesStore: IResourceState<IReleaseNote[]> =
    releaseNotesEngine.releasesState((state) => state);
  const releaseNoteRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    releaseNotesEngine.fetchReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = releaseNotesStore.loading;

  function getLatestReleaseInfo(releaseBody: string): string[] {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = marked.parse(releaseBody);
    const listElements: string[] = [];
    wrapper.querySelectorAll('li').forEach((li, index) => {
      if (index < 4) {
        listElements.push(
          li.innerText.replace(
            // eslint-disable-next-line no-useless-escape
            /(\sby\s\@[A-z\d](?:[A-z\d]|-(?=[A-z\d])){0,38}\s\w+\shttps\:\/\/github\.com\/((\w+\/?){4}))/g,
            '',
          ),
        );
      }
    });
    return listElements;
  }

  function modifyReleaseName(releaseTitle: string): string {
    // eslint-disable-next-line no-useless-escape
    return releaseTitle.replace(/(^\🚀\s*v\d+\.\d+\.\d+\s*\-\s*)/, '');
  }

  const changelogData: { tagName: string; info: string; url: string }[] =
    React.useMemo(() => {
      return (releaseNotesStore?.data ?? []).map((release: IReleaseNote) => ({
        tagName: release.tag_name,
        info: modifyReleaseName(release.name),
        url: release.html_url,
      }));
    }, [releaseNotesStore.data]);

  const LatestReleaseData:
    | { tagName: string; info: string[]; url: string }
    | undefined = React.useMemo(() => {
    const latest = releaseNotesStore?.data?.[0];
    if (latest) {
      return {
        tagName: latest.tag_name,
        info: getLatestReleaseInfo(latest.body),
        url: latest.html_url,
      };
    }
  }, [releaseNotesStore.data]);

  return {
    changelogData,
    LatestReleaseData,
    isLoading,
    releaseNoteRef,
  };
}

export default useReleaseNotes;
