import React from 'react';
import QRCode from 'qrcode.react';

function GenerateQRCode({ fileId }) {
    const loginUrl = `https://uztelecom-xi.vercel.app/scan?file_id=${fileId}`;

    return (
        <div>
            <QRCode value={loginUrl} size={256} />
        </div>
    );
}

export default GenerateQRCode;
