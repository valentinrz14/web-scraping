import { Page } from "playwright";

type GetHeaderImageProps = (page: Page) => Promise<string>;

const HEADER_IMAGE_ID = "Grafik03";

export const getHeaderImage: GetHeaderImageProps = async (page) => {
  await page.waitForTimeout(20000);
  await page.waitForSelector(`img#${HEADER_IMAGE_ID}`);
  const image = await page.$eval(`img#${HEADER_IMAGE_ID}`, (item) =>
    item.getAttribute("src")
  );

  return image || "";
};
