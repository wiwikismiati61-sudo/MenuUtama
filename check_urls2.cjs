const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ 
          url, 
          statusCode: res.statusCode, 
          headers: res.headers,
          dataLength: data.length,
          preview: data.substring(0, 100)
        });
      });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
}

async function main() {
  const urls = [
    'https://i.ibb.co/Rp7VBt3Y/kilas-aplikasi.png',
    'https://i.ibb.co/DDvBMgFH/gambar-2.jpg',
    'https://i.ibb.co/5wM2Bd4/gambar-3.jpg'
  ];
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(result.url);
    console.log('Status:', result.statusCode);
    console.log('Content-Type:', result.headers['content-type']);
    console.log('Length:', result.dataLength);
    console.log('Preview:', result.preview);
    console.log('---');
  }
}

main();
