const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, error: e.message });
    });
  });
}

async function main() {
  const urls = [
    'https://i.ibb.co/Rp7VBt3Y/kilas-aplikasi.png',
    'https://i.ibb.co/ZtqkYcY/kilas-aplikasi.jpg',
    'https://i.ibb.co/DDvBMgFH/gambar-2.jpg',
    'https://i.ibb.co/5wM2Bd4/gambar-3.jpg'
  ];
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(result);
  }
}

main();
