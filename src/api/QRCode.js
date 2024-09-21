import React from 'react';
import QRCode from 'qrcode.react';

function GenerateQRCode({ fileId }) {
    // URL ni `file_id` bilan birga generatsiya qilish
    const scanUrl = `https://uztelecom-xi.vercel.app/scan?file_id=${fileId}`;

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <QRCode value={scanUrl} size={256} />
        </div>
    );
}

export default GenerateQRCode;


