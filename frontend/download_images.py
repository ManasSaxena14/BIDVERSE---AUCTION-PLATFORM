import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

urls = {
    'bruce_wayne.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Christian_Bale_2013.jpg/400px-Christian_Bale_2013.jpg',
    'roman_reigns.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Roman_Reigns_at_WrestleMania_38_Night_Two_%281%29.jpg/400px-Roman_Reigns_at_WrestleMania_38_Night_Two_%281%29.jpg',
    'hrithik_roshan.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Hrithik_Roshan_in_2023_%28cropped%29.jpg/400px-Hrithik_Roshan_in_2023_%28cropped%29.jpg',
    'rohit_sharma.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Rohit_Sharma_November_2023_%28cropped%29.jpg/400px-Rohit_Sharma_November_2023_%28cropped%29.jpg',
}

os.makedirs('frontend/public/images', exist_ok=True)

for name, url in urls.items():
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            with open(os.path.join('frontend/public/images', name), 'wb') as f:
                f.write(response.read())
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")
