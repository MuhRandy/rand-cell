from bs4 import BeautifulSoup as bs
from pydantic import BaseModel
import requests
import json

class Price(BaseModel):
    code: str
    product: str
    price: int

class Product(BaseModel):
    name: str
    url: str
    prices: list[Price] = []
    
def strip_text(text: str):
    return text.lower().replace('\xa0', '').replace('»', '').strip().replace(' ', '-')

def convert_to_json(objects: list):
    data_json = [object.dict() for object in objects]
    return json.dumps(data_json, indent=2)

def save_to_json(data):
    with open('data.json', 'w') as file:
        file.write(data)
  
def get_products():
    URL = 'https://isipulsa.web.id/harga'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(URL, headers=headers)
    soup = bs(response.content, 'html.parser')
    products_select = soup.find_all('a', class_='list-group-item')
    
    products = []
    for element in products_select:
        name = strip_text(element.text)
        url = element.get('href')
        if url == '#' or name == 'tampilkan-semua':
          continue
        products.append(Product(name=name, url=url))
    
    return products
  
def get_prices(product: Product):
    URL = product.url
    max_page = 1
    prices = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    current_page = 1
    while current_page <= max_page:
      CURRENT_URL = f"{URL}?page={current_page}"
      response = requests.get(CURRENT_URL, headers=headers)
      soup = bs(response.content, 'html.parser')
      
      pagination = soup.select_one('ul.pagination')
      max_page = get_max_page(pagination)
      
      try:
        table = soup.select_one('table.table.table-hover.hidden-xs')
        prices_select = table.select('tr')
        prices_select.pop(0)
        
        for price in prices_select:
            code = price.select_one('td').get_text()
            product = price.select_one('td:nth-child(2)').get_text()
            price = int(price.select_one('td:nth-child(3)').get_text().split('Rp ')[1].replace('.', ''))
            prices.append(Price(code=code, product=product, price=price))
        current_page += 1
      except:
        break
    
    return prices

def get_max_page(soup):
  try:
    page_links = soup.select('.pagination a')

    # Extract the page numbers from the href attributes
    page_numbers = []
    for link in page_links:
        href = link.get('href')
        if href:
            # Extract the page number from the href
            page_number = href.split('=')[-1]
            if page_number.isdigit():
                page_numbers.append(int(page_number))

    # Find the maximum page number
    max_page = max(page_numbers) if page_numbers else None
    
    return max_page
  except:
    return 1

def main():
    print("Scraping data...")
    products = get_products()
    
    for product in products:
        NAME = product.name
        prices = get_prices(product)
        product.prices = prices
        
    data = convert_to_json(products)
    save_to_json(data)
    print("Data scraped successfully!")

if __name__ == '__main__':
    main()