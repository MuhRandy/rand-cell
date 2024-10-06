import FetchData from "../services/FetchData";
import { cn } from "../utils/util";
import { useEffect, useState } from "react";

function ProductTypes() {
  const [providerNames, setProviderNames] = useState<Array<string>>();
  const [productType, setProductType] = useState<Array<string>>();

  useEffect(() => {
    FetchData.getAndPopulateProviders().then((providers) => {
      setProviderNames(
        Array.from(
          new Set(
            providers?.map((provider) => {
              return provider.provider;
            })
          )
        )
      );

      const productTypeSet: Set<string> = new Set();

      providers?.forEach((provider) => {
        provider.products.forEach((product) => {
          productTypeSet.add(product.type);
        });
      });

      setProductType(Array.from(productTypeSet));
    });
  }, []);

  return (
    <div className={cn("text-center", "grid grid-cols-6 gap-2", "p-3")}>
      {productType?.map((type, i) => {
        return (
          <div key={i} className={cn("border rounded-md p-2")}>
            {type}
          </div>
        );
      })}
    </div>
  );
}

export default ProductTypes;
