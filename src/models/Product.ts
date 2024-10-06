export default class Product {
  readonly product: string;
  readonly type: string;
  readonly price: number;
  readonly code: string;

  constructor(product: string, type: string, price: number, code: string) {
    this.product = product;
    this.type = type;
    this.price = price;
    this.code = code;
  }
}
