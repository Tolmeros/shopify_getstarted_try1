import React, {useCallback, useState, useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
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

const GET_PRODUCTS = gql`
query {
  products(first: 10) {
    edges {
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
`;

const GET_PRODUCTS_PAGED = gql`
query GetProductsPaged($count: Int, $cursor: String) {
  products(first: $count, after: $cursor) {
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

export function ResourceListExample() {
  let loading = true;
  let error = null;
  let data = null;
  let refetch = null;

  let cursor = null;

  { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      count: PRODUCTS_COUNT_ON_PAGE,
      cursor: cursor,
    },
  });

  /*
  useEffect(() => {
    let { loading, error, data, refetch } = useQuery(GET_PRODUCTS, {
      variables: {
        count: PRODUCTS_COUNT_ON_PAGE,
        cursor: cursor,
      },
    });
  }, [loading, error, data, refetch, cursor]);
  */

  if (!loading) {
    console.log('data ', data);
    console.log('error ', error);
  }

  if (loading) return <Loading />;

  /*
  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }
  */

  const handleNext = useCallback(
    () => {
      console.log('handleNext');
      cursor = data.products.edges[data.products.edges.length-1].cursor;
      console.log('handleNext cursor ', cursor);
      const tmp = useQuery(GET_PRODUCTS, {
        variables: {
          count: PRODUCTS_COUNT_ON_PAGE,
          cursor: cursor,
        },
      });
      data = tmp.data;
    },
    [loading, error, data, refetch, cursor]
  );

  const handlePrevious = useCallback(
    () => {
      console.log('handlePrevious');
    },
    [data]
  );

  return (
    <div>
    <ResourceList // Defines your resource list component
      showHeader
      resourceName={{ singular: "Product", plural: "Products" }}
      items={data.products.edges}
      renderItem={(item) => {
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
      }}
    />
    <Pagination
      hasPrevious = {data.products.pageInfo.hasPreviousPage}
      onPrevious = {handlePrevious}
      hasNext = {data.products.pageInfo.hasNextPage}
      onNext = {handleNext}
    />
    </div>
  );
}
