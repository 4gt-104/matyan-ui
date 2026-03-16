import _ from 'lodash-es';

export function getDocumentTitle(pathname: string): {
  title: string;
  withPrefix: boolean;
} {
  const paths = pathname.slice(1).split('/');
  if (paths[0]) {
    return { title: _.capitalize(paths[0]), withPrefix: true };
  }
  return { title: 'Matyan', withPrefix: false };
}

export function setDocumentTitle(
  title: string = 'Matyan',
  withPrefix: boolean = false,
): void {
  document.title = title + (withPrefix ? ' | Matyan' : '');
}
