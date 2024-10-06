import Product from "./Product";

export default class Provider {
  readonly provider: string;
  readonly type: string;
  readonly products: Product[];

  constructor(provider: string, products: Product[], type: string) {
    this.provider = provider;
    this.products = products;
    this.type = type;
  }
}
