import sys, json, base64, urllib.parse, subprocess, os

# Get file list
result = subprocess.run([
    'curl', '-k', '-s', 
    '-H', 'Authorization: whm unrecord:05TD5C3VKIQ72MY0BBH8H9G6P2ZB87SO',
    'https://149.255.58.163:2087/json-api/cpanel?cpanel_jsonapi_user=elevationsecurit&cpanel_jsonapi_apiversion=3&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=list_files&dir=/home/elevationsecurit/public_html/images'
], capture_output=True, text=True)

data = json.loads(result.stdout)
files = data['result']['data']

os.makedirs('images', exist_ok=True)

for f in files:
    if f['type'] == 'file':
        filename = f['file']
        encoded = urllib.parse.quote_plus(filename)
        url = f"https://149.255.58.163:2087/json-api/cpanel?cpanel_jsonapi_user=elevationsecurit&cpanel_jsonapi_apiversion=3&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=get_file_content&dir=/home/elevationsecurit/public_html/images&file={encoded}"
        
        # Use -o to save binary directly
        result = subprocess.run([
            'curl', '-k', '-s', 
            '-H', 'Authorization: whm unrecord:05TD5C3VKIQ72MY0BBH8H9G6P2ZB87SO',
            url, '-o', f'images/{filename}'
        ], capture_output=True)
        
        if result.returncode == 0 and os.path.exists(f'images/{filename}'):
            size = os.path.getsize(f'images/{filename}')
            print(f'{filename} done ({size} bytes)')
        else:
            print(f'{filename} failed: {result.stderr[:100] if result.stderr else "unknown"}')