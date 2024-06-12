import { readFileSync, writeFileSync } from "fs";

// get json data and store it in jsonData
const rawData = readFileSync("./data.json");
const jsonData = JSON.parse(rawData);

// initialize variable to store data
const productCategory = new Set();
const finalJsonData = [];

jsonData.map((product) => {
  // Split product name with the first '-' and change product.name with that
  product.name = product.name.split(/-(.*)/s);

  // Delete '(' and ')' from second item in product.name
  // Using If just to avoid error when second item doesn't exist
  if (product.name.length > 1) {
    product.name[1] = product.name[1].replace("(", "").replace(")", "");
  }

  // Add product name to set so it will be unique
  productCategory.add(product.name[0]);
});

for (const category of productCategory) {
  // create temporary variable for storing data
  const tempArr = [];
  const tempCategoryObj = {
    name: category,
    detail: [],
  };

  // Separate product based on the first item in product.name
  jsonData.map((product) => {
    if (product.name[0] === category && product.prices.length !== 0) {
      tempArr.push(product);
    }
  });

  tempArr.map((product) => {
    const tempObj = {
      name: "",
      detail: [],
    };
    const exclude = [
      "Voucher Internet",
      "Inject Voucher",
      "Inject Kartu Perdana",
      "Bebas Nominal",
      "Tagihan",
      "Transfer Dana",
    ];

    tempObj.name = product.name[0];

    if (product.name.length > 1) {
      tempObj.name = product.name[1];
    } else {
      tempObj.name = product.name[0];
    }

    product.prices.map((detail) => {
      const tempDetailObj = {
        product: "",
      };

      detail.product = detail.product.split(" - ");

      tempDetailObj.product = detail.product[1];
      tempDetailObj.type = detail.product[0];
      tempDetailObj.price = detail.price;

      const regExp = RegExp(`(${exclude.join("|")})`);

      // Excluding unwanted date which is type on exclude and price is 0
      if (!tempDetailObj.type.match(regExp) && tempDetailObj.price !== 0) {
        tempObj.detail.push(tempDetailObj);
      }
    });

    // Exluding no detail
    if (tempObj.detail.length !== 0) {
      tempCategoryObj.detail.push(tempObj);
    }
  });

  // Exluding no detail
  if (tempCategoryObj.detail.length !== 0) {
    finalJsonData.push(tempCategoryObj);
  }
}

// write finalJsonData in finalData.json
writeFileSync("./scripts/finalData.json", JSON.stringify(finalJsonData));
