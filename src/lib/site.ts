const repository = process.env.GITHUB_REPOSITORY || '';
const [repoOwner = '', repoName = ''] = repository.split('/');

const isProjectPagesRepo = Boolean(
    repoOwner
    && repoName
    && repoName.toLowerCase() !== `${repoOwner}.github.io`.toLowerCase()
);

export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH
    ?? (isProjectPagesRepo ? `/${repoName}` : '');

export const siteOrigin = repoOwner
    ? `https://${repoOwner}.github.io`
    : 'http://localhost:3000';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ?? `${siteOrigin}${siteBasePath}`;

export const withBasePath = (value = '') => {
    if (!value) return value;

    if (
        /^(?:[a-z]+:)?\/\//i.test(value)
        || value.startsWith('mailto:')
        || value.startsWith('tel:')
        || value.startsWith('data:')
        || value.startsWith('blob:')
        || value.startsWith('#')
    ) {
        return value;
    }

    const normalizedValue = value.startsWith('/') ? value : `/${value}`;
    return `${siteBasePath}${normalizedValue}`;
};

export const isExternalHref = (value = '') => /^(?:[a-z]+:)?\/\//i.test(value);
