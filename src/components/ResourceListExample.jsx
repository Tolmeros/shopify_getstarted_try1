import React, {useCallback, useState, useEffect, useMemo} from 'react';
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  Filters,
  ResourceItem,
  ResourceList,
  TextField,
  TextStyle,
  Stack,
  Thumbnail,
  Pagination
} from '@shopify/polaris';

import { Loading, Banner } from "@shopify/app-bridge-react";

const PRODUCTS_COUNT_ON_PAGE = 10;

const GET_PRODUCTS_PAGED = gql`
query GetProductsPaged($countNext: Int, $cursorNext: String,
                       $countPrev: Int, $cursorPrev: String,
                       $orderReverse: Boolean,
                       $queryStr: String) {
  products(first: $countNext, after: $cursorNext,
           last: $countPrev, before: $cursorPrev,
           reverse: $orderReverse, sortKey: TITLE,
           query: $queryStr) {
    edges {
      cursor
      node {
        id
        title
        handle
        descriptionHtml
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`

var mdata = null;

const TITLE_AZ='TITLE_AZ';
const TITLE_ZA='TITLE_ZA';

export function ResourceListExample() {
  const [sortValue, setSortValue] = useState(TITLE_AZ);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);

  const [getProducts, { loading, error, data }] = useLazyQuery(GET_PRODUCTS_PAGED);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleQueryValueChange = useCallback(
    (value) => {
      getProducts({
        variables: {
          queryStr: value,
        }
      });
      setQueryValue(value)
    },
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  useEffect(() => {
    //console.log('getProducts ');
    getProducts({
      variables: {
        countNext: PRODUCTS_COUNT_ON_PAGE,
        orderReverse: false,
      }
    });
  }, []);

  const filters = [
    {
      key: 'taggedWith3',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: 'taggedWith3',
          label: disambiguateLabel('taggedWith3', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{paddingLeft: '8px'}}>
        <Button onClick={() => console.log('New filter saved')}>Save</Button>
      </div>
    </Filters>
  );
  

  if (!loading) {
    console.log('data ', data);
    console.log('error ', error);
  }

  if (data) {
    mdata = data;
  }

  const handleNext = useCallback(
    () => {
      console.log('handleNext');
      const cursor = mdata.products.edges[data.products.edges.length-1].cursor;
      //useMemo

      //вынести в location
      //app bridge
      console.log('handleNext cursor ', cursor);
      getProducts({
        variables: {
          countNext: PRODUCTS_COUNT_ON_PAGE,
          cursorNext: cursor,
          countPrev: null,
          cursorPrev: null,
        }
      });
    },
    [getProducts, mdata]
  );

  const handlePrevious = useCallback(
    () => {
      console.log('handlePrevious');
      const cursor = mdata.products.edges[0].cursor;
      console.log('handlePrevious cursor ', cursor);
      getProducts({
        variables: {
          countPrev: PRODUCTS_COUNT_ON_PAGE,
          cursorPrev: cursor,
          countNext: null,
          cursorNext: null,
        }
      });
    },
    [getProducts, mdata]
  );

  if (!mdata && loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <React.Fragment>
    { mdata && (
      <React.Fragment>
      <ResourceList // Defines your resource list component
        showHeader
        resourceName={{ singular: "Product", plural: "Products" }}
        loading={loading}
        items={mdata.products.edges}
        sortValue={sortValue}
        sortOptions={[
          {label: 'title Z-A', value: TITLE_ZA},
          {label: 'title A-Z', value: TITLE_AZ},
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
          const orderReverse = (selected !== TITLE_AZ);
          getProducts({
            variables: {
              countNext: PRODUCTS_COUNT_ON_PAGE,
              orderReverse,
              countPrev: null,
              cursorPrev: null,
              cursorNext: null,
            }
          });
        }}
        renderItem={renderItem}
        filterControl={filterControl}
      />
      <Pagination
        hasPrevious = {mdata.products.pageInfo.hasPreviousPage}
        onPrevious = {handlePrevious}
        hasNext = {mdata.products.pageInfo.hasNextPage}
        onNext = {handleNext}
      />
      </React.Fragment>
    )}
    </React.Fragment>
  );

  function renderItem(item) {
    const media = (
      <Thumbnail
        source={
          item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : ""
        }
        alt={item.node.images.edges[0] ? item.node.images.edges[0].node.altText : ""}
      />
    );
    const price = item.node.variants.edges[0].node.price;
    return (
      <ResourceList.Item
        id={item.node.id}
        media={media}
        accessibilityLabel={`View details for ${item.title}`}
      >
        <Stack>
          <Stack.Item fill>
            <h3>
              <TextStyle variation="strong">{item.node.title}</TextStyle>
            </h3>
          </Stack.Item>
          <Stack.Item>
            <p>${price}</p>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    );
  }
}
