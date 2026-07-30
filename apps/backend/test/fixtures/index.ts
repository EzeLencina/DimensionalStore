export const testFixtures = {
  validPagination: {
    page: 1,
    limit: 20,
  },

  validSorting: {
    sort: '-createdAt,+name',
  },

  validFiltering: {
    filter: JSON.stringify([
      {
        logic: 'AND',
        conditions: [{ field: 'status', operator: 'eq', value: 'active' }],
      },
    ]),
  },

  invalidPagination: {
    page: 0,
    limit: -1,
  },

  exceededPagination: {
    page: 1,
    limit: 9999,
  },

  invalidSorting: {
    sort: 'invalidField',
  },

  invalidFiltering: {
    filter: 'not-json',
  },

  validSearch: {
    search: 'test query',
  },

  shortSearch: {
    search: 'x',
  },

  apiVersionHeader: {
    'x-api-version': '1.0',
  },

  unsupportedVersion: {
    'x-api-version': '99.0',
  },
} as const;
