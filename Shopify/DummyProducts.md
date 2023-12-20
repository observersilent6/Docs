# Dummy Products Resources Links

https://github.com/shopifypartners/product-csvs



#### API Docs
https://shopify.dev/docs/api/admin-rest


#### Curl Converter
https://curlconverter.com/

#### SHOPIFY ADMIN API

import requests

headers = {
    'X-Shopify-Access-Token': '{access_token}',
}

response = requests.get('https://your-development-store.myshopify.com/admin/api/2023-10/collects.json', headers=headers)

print(response.json())