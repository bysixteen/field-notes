import { allSources } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

const search = createSearchAPI('advanced', {
  indexes: allSources.flatMap((s) =>
    s.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    })),
  ),
});

export const dynamic = 'force-static';
export const GET = search.staticGET;
