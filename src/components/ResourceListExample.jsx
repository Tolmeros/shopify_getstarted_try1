import React, {useCallback, useState, useEffect} from 'react';
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

const GET_PRODUCTS = gql`
query {
  products(first: 10) {
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

const GET_PRODUCTS_PAGED = gql`
query GetProductsPaged($countNext: Int, $cursorNext: String,
                       $countPrev: Int, $cursorPrev: String) {
  products(first: $countNext, after: $cursorNext,
           last: $countPrev, before: $cursorPrev) {
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

const GET_PRODUCTS_PAGED_NEXT = gql`
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

const GET_PRODUCTS_PAGED_PREV = gql`
query GetProductsPaged($count: Int, $cursor: String) {
  products(last: $count, before: $cursor) {
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
  //const [getProducts, { loading, error, data }] = useLazyQuery(GET_PRODUCTS_PAGED_NEXT);
  //GET_PRODUCTS

  /*
  const [products, setProducts] = useState({
    edges: [],
    pageInfo: {
      "hasNextPage": false,
      "hasPreviousPage": false,
    }
  });
  */

  //const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [getProducts, { loading, error, data }] = useLazyQuery(GET_PRODUCTS);

  //getProducts();
  
  /*
  useEffect(() => {
    getProducts();
  }, []);
  */

  if (!loading) {
    console.log('data ', data);
    console.log('error ', error);
  }

  /*
  if (data && data.products) {
    setProducts(data.products);
  }
  */

  const handleNext = useCallback(
    () => {
      console.log('handleNext');
      cursor = data.products.edges[data.products.edges.length-1].cursor;
      console.log('handleNext cursor ', cursor);
      getProducts({
        variables: {
          countNext: PRODUCTS_COUNT_ON_PAGE,
          cursorNext: cursor,
        }
      });
    },
    []
  );

  const handlePrevious = useCallback(
    () => {
      console.log('handlePrevious');
      cursor = data.products.edges[0].cursor;
      console.log('handlePrevious cursor ', cursor);
      getProducts({
        variables: {
          countPrev: PRODUCTS_COUNT_ON_PAGE,
          cursorPrev: cursor,
        }
      });
    },
    []
  );

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }


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
