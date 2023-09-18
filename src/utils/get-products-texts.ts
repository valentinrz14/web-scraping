import { Page } from "playwright";

type GetProductsTextsProps = (page: Page, selector: string) => Promise<string[]>;

export const getProductsTexts: GetProductsTextsProps = async (
  page,
  selector
) => {
  await page.waitForSelector(selector);
  const allTexts = await page.locator(selector).allInnerTexts();
  return allTexts;
};
