import { chromium } from "playwright";
import fs from "fs";
import {
  PAGE_HEADER_IMAGES_TIMEOUT,
  PAGE_PRODUCTS_TIMEOUT,
  PAGE_PRODUCT_DETAIL_TIMEOUT,
  URLS,
} from "./constantes";
import { DataResponse, ProductDetailResponse, ProductsResponse } from "./types";
import { getHeaderImage } from "./utils/get-header-image";
import { getProductsTexts } from "./utils/get-products-texts";
import { getTextFiltered } from "./utils/get-text-filtered";

const headerImage: Array<string> = [];
const productPriceFilter: Array<
  Pick<
    ProductsResponse,
    "oldPrice" | "discountPrice" | "porcentagePrice" | "price"
  >
> = [];
let pruductObjet: any = {};

(async () => {
  const browser = await chromium.launch({
    args: ["--window-size=1920,1080"],
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  // Get Carrousel Images
  const pageHeaderImages = await context.newPage();
  await pageHeaderImages.goto(URLS.PAGE_HEADER_IMAGES, {
    timeout: PAGE_HEADER_IMAGES_TIMEOUT,
  });

  for (let i = 0; i < 20; i++) {
    const image = await getHeaderImage(pageHeaderImages);
    headerImage.push(image);
  }

  const filterHeaderImage = headerImage.filter((item, index, self) => {
    const firstIndex = self.findIndex((findtItem) => findtItem === item);
    return index === firstIndex;
  });

  await pageHeaderImages.close();

  // Get Products
  const pageProducts = await context.newPage();
  await pageProducts.goto(URLS.PAGE_PRODUCTS, {
    timeout: PAGE_PRODUCTS_TIMEOUT,
  });

  const productNames = await getProductsTexts(
    pageProducts,
    "span.ArtikelStartseiteHaupt"
  );

  const productId = await getProductsTexts(
    pageProducts,
    "div#ArtikelBezeichnung"
  );

  const productFilterId = getTextFiltered(productId, 3);

  const productsCategory = await getProductsTexts(
    pageProducts,
    "span.Hauptauswahl"
  );

  await pageProducts.waitForSelector(
    "#DreiBild > form > input[type=image]:nth-child(6)"
  );

  const productImage = await pageProducts.evaluate(() => {
    const images = document.querySelectorAll(
      "#DreiBild > form > input[type=image]:nth-child(6)"
    );
    const urls = [];
    for (let image of images) {
      urls.push(image.getAttribute("src"));
    }
    return urls;
  });

  const productPrices = await getProductsTexts(
    pageProducts,
    "#DreiPreisBox > span"
  );

  for (const cadena of productPrices) {
    if (cadena.includes("precio")) {
      const oldPrice = cadena.match(/\d+,\d+/);
      if (oldPrice) {
        pruductObjet.oldPrice = oldPrice[0];
      }
    } else if (cadena.includes("ahóra")) {
      const price = cadena.match(/\d+,\d+/);
      if (price) {
        pruductObjet.price = price[0];
      }
    } else if (cadena.includes("\neconomiza")) {
      const discountPrice = cadena.match(/\d+,\d+/);
      const porcentagePrice = cadena.match(/\d+%/);
      if (discountPrice) {
        pruductObjet.discountPrice = discountPrice[0];
      }
      if (porcentagePrice) {
        pruductObjet.porcentagePrice = porcentagePrice[0];
      }
    } else {
      const price = cadena.match(/\d+,\d+/);
      if (price) {
        pruductObjet.price = price[0];
        pruductObjet.oldPrice = undefined;
        pruductObjet.discountPrice = undefined;
        pruductObjet.porcentagePrice = undefined;
      }
    }

    if (Object.keys(pruductObjet).length === 4) {
      productPriceFilter.push(pruductObjet);
      pruductObjet = {};
    }
  }

  const products: ProductsResponse[] = productId.map((_, index) => {
    return {
      id: productFilterId[index],
      category: productsCategory[index + 3],
      name: productNames[index],
      image: productImage[index],
      ...productPriceFilter[index],
    };
  });

  const data: DataResponse[] = [{ carouselImage: filterHeaderImage, products }];

  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${__dirname}/assets/products.json`, jsonData);

  // Get Product Detail with `id`
  const pageProductDetail = await context.newPage();

  const id = "99940";

  await pageProductDetail.goto(URLS.PAGE_PRODUCT_DETAIL(id), {
    timeout: PAGE_PRODUCT_DETAIL_TIMEOUT,
  });

  const productDetailTexts = await getProductsTexts(
    pageProductDetail,
    "div.ArtikelUnter"
  );

  await pageProductDetail.waitForSelector("a>img");
  const productDetailImages = await pageProductDetail.evaluate(() => {
    const images = document.querySelectorAll("a>img");
    const urls = [];
    for (let image of images) {
      urls.push(image.getAttribute("src"));
    }
    return urls;
  });

  const prouductDetail: ProductDetailResponse = {
    id,
    category: productDetailTexts[0],
    manufacter: productDetailTexts[1],
    scale: productDetailTexts[2],
    type: productDetailTexts[3],
    name: productDetailTexts[4],
    material: productDetailTexts[5],
    year: productDetailTexts[6],
    color: productDetailTexts[7],
    images: productDetailImages,
  };

  const jsonDataProductDetail = JSON.stringify(prouductDetail, null, 2);
  fs.writeFileSync(
    `${__dirname}/assets/products-detail.json`,
    jsonDataProductDetail
  );

  console.log("Web Scraping finished");

  await browser.close();
})();
