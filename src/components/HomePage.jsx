import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ProductsCard } from "./ProductsCard";
//import { EmptyStatePage } from "./EmptyStatePage";
import { ResourceListExample } from "./ResourceListExample";

export function HomePage() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section >
          <ResourceListExample />
        </Layout.Section>
        <Layout.Section secondary>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
