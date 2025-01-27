import  qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth  } = pkg;

const whatsapp = new Client({
//   puppeteer: {
// 		args: ['--no-sandbox', '--disable-setuid-sandbox'],
// 	},
  authStrategy: new LocalAuth(),
//   webVersion: '2.2412.54',
//   webVersionCache: {
//     type: 'remote',
//     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
//   },
});

whatsapp.on('qr', qr => {
  qrcode.generate(qr, {
      small: true
  });
});

whatsapp.on('ready', () => {
  console.log('Client is ready!');
});

export {
    whatsapp
}