import PopulateData from "./PopulateData";

export default class FetchData {
  static async fetchData(request: Request) {
    try {
      const response = await fetch(request);
      const json = await response.json();

      return json;
    } catch (error) {
      console.log(error);
    }
  }

  static async getAndPopulateProviders() {
    try {
      const request = new Request("http://localhost:5173/data.json");
      const json = await this.fetchData(request);
      //   const filteredData = json.filter((data) => data.name.includes("axis"));

      // console.log(filteredData);

      //   console.log(json);

      const providers = PopulateData.populateProviders(json);

      const providersWithProducts = providers.filter(
        (data) => data.products.length !== 0
      );

      return providersWithProducts;
    } catch (error) {
      console.log(error);
    }
  }
}
