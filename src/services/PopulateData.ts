import Product from "../models/Product";
import Provider from "../models/Provider";
import StringService from "./StringService";

type JsonType = {
  name: string;
  prices: {
    price: number;
    product: string;
    code: string;
  }[];
}[];

export default class PopulateData {
  static readonly includedProductType = [
    "Paket Internet",
    "Token PLN",
    "Game",
    "Paket Telp & SMS",
    "Masa Aktif",
    "Voucher Wifi ID",
    "Saldo Gojek",
    "Saldo Grab",
    "Saldo E TOL",
    "Voucher Mobile Legend",
    "Voucher Free Fire",
    "Dompet Digital",
    "Bioskop",
    "Dompet Digital 2",
    "Voucher Belanja",
    "Transfer Dana",
    "Bebas Nominal",
  ];

  static readonly excludedProductType = [
    "Voucher Internet",
    "Tagihan",
    "Tagihan PDAM",
    "Inject Kartu Perdana",
    "Inject Voucher",
  ];

  static populateProviders(json: JsonType) {
    return json.map((data) => {
      const [name, type] = StringService.splitByFirstHyphen(data.name);

      const provider = new Provider(
        name,
        [],
        type ? StringService.bracketCleaner(type) : name
      );
      data.prices.forEach((item) => {
        const [type, productName] = StringService.splitByHyphen(item.product);

        if (!this.excludedProductType.includes(type)) {
          const product = new Product(productName, type, item.price, item.code);

          provider.products.push(product);
        }
      });

      return provider;
    });
  }
}
