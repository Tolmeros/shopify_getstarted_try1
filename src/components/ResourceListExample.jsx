import React, {useCallback, useState} from 'react';
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
  Thumbnail
} from '@shopify/polaris';

import { Loading, Banner } from "@shopify/app-bridge-react";

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

export function ResourceListExample() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);

  if (!loading) {
    console.log('data ', data);
    console.log('error ', error);
  }

  //if (loading) return <Loading />;

  if (loading) return <Loading />;

  /*
  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }
  */

  return (
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
  );
}
