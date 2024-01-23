const URL_DEFAULT = "https://www.modelissimo.eu";

export const URLS = {
  PAGE_HEADER_IMAGES: `${URL_DEFAULT}/webseite/topleiste.php?Ident=1694294890&Sprache=0`,
  PAGE_PRODUCTS: `${URL_DEFAULT}/Modelissimo/Mitte.php?Ident=1694308908&Sprache=4&HF=IND1&StartseiteAnzeigen=1#`,
  PAGE_PRODUCT_DETAIL: (id: string) =>
    `${URL_DEFAULT}/Modelissimo/Mitte.php?SeiteAnzeigen=1&a=1&Ident=1695010306&Sprache=4&Sortierung=NeuDatum%20desc,%20MSONArtikel.Artikelnummer%20desc&fbl=&Detail=${id}`,
};

export const PAGE_PRODUCT_DETAIL_TIMEOUT = 15000; // 10 seconds
export const PAGE_PRODUCTS_TIMEOUT = 480000; // 8 minutes
export const PAGE_HEADER_IMAGES_TIMEOUT = 10000; // 10 seconds

