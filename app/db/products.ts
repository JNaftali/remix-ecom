export interface Product {
   name: string;
   slug: string;
   variants: Variant[];
}

export interface Variant {
   name: string;
   sku: string;
   price: number;
}

const products: Product[] = [
   {
      name: "Shampoo",
      slug: "shampoo",
      variants: [
         {
            name: "16oz",
            sku: "1612345",
            price: 30,
         },
      ],
   },
];

export function getAllProducts() {
   return products;
}

export function getProductBySlug(slug: string) {
   return products.find((p) => p.slug === slug);
}

export function getVariantBySku(sku: string) {
   const variant = products
      .flatMap((p) => p.variants)
      .find((v) => v.sku === sku);

   if (!variant) return undefined;

   const product = products.find((p) => p.variants.includes(variant))!;
   return {
      ...variant,
      product,
   };
}
