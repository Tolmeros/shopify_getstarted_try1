import React, {useCallback, useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  FormLayout,
  TextField,
  Page
} from '@shopify/polaris';
import { gql, useMutation } from "@apollo/client";
import { Loading } from "@shopify/app-bridge-react";

const ADD_PRODUCT = gql`
mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product {
      id
      title
      productType
      vendor

    }
    userErrors {
      field
      message
    }
  }
}
`

export function NewItem() {

  const [productTitle, setProductTitle] = useState('');
  const [productVendor, setProductVendor] = useState('');
  const [productType, setProductType] = useState('');

  const [addProduct, { loading, error, data }] = useMutation(ADD_PRODUCT);

  const navigate = useNavigate(); 

  const routeChange = () => { 
    let path = `/`; 
    navigate(path);
  }

  const handleSubmit = useCallback((_event) => {
    //setEmail('');
    //setNewsletter(false);
    console.log('handleSubmit ', productTitle);
    addProduct({
      variables: {
        input: {
          title: productTitle,
          vendor: productVendor,
          productType: productType,
        }
      }
    });
  }, [productTitle, productVendor, productType, addProduct]);

  const handleProductTitleChange = useCallback(
    (value) => {
      setProductTitle(value);
      console.log('handleProductTitleChange ', value);
    },
    []
  );

  const handleProductVendorChange = useCallback(
    (value) => setProductVendor(value),
    []
  );

  const handleProductTypeChange = useCallback(
    (value) => setProductType(value),
    []
  );

  useEffect(() => {
    console.log('useEffect', data);
  }, [data]);

  return (
    <Page fullWidth>
      <div>New</div>
      <Button
        primary
        loading={loading}
        onClick={routeChange}
      >
        back
      </Button>
      { loading && (<Loading />)}
      { data && data.product && (<div>ok<br/>{data.product.title}</div>)}
      { error && (<div>error</div>)}
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <TextField
            value={productTitle}
            onChange={handleProductTitleChange}
            label="Title"
            helpText={
              <span>
                Product title.
              </span>
            }
          />
          <TextField
            value={productVendor}
            onChange={handleProductVendorChange}
            label="Vendor"
            helpText={
              <span>
                Vendor.
              </span>
            }
          />
          <TextField
            value={productType}
            onChange={handleProductTypeChange}
            label="Product type"
            helpText={
              <span>
                Product type.
              </span>
            }
          />

          <Button submit>Submit</Button>
        </FormLayout>
      </Form>
    </Page>
  );
}
