export function adaptFacetConfig(facetConfig) {
  if (!facetConfig) return;

  const convertInvalidFacetsToUndefined = ([fieldName, config]) => {
    if (config.type != "value") {
      console.warn(
        `Dropping ${fieldName} facet, only value facets are supported in Site Search`
      );
      return;
    }
    return [fieldName, config];
  };

  const getKey = ([key]) => key;

  const config = Object.entries(facetConfig)
    .map(convertInvalidFacetsToUndefined)
    .filter(v => v)
    .map(getKey);

  if (!config.length) return;
  return config;
}

export function adaptFilterConfig(filterConfig) {
  if (!filterConfig) return;

  return filterConfig.all.reduce((acc, filter) => {
    const [fieldName, fieldValue] = Object.entries(filter)[0];

    if (!acc[fieldName]) {
      acc[fieldName] = {
        type: "and",
        values: []
      };
    }

    acc[fieldName].values.push(fieldValue);

    return acc;
  }, {});
}
