import React, { useState } from 'react';

const ScinerPage = () => {
    const [scannedData, setScannedData] = useState('');

    const handleScan = (data) => {
        if (data) {
            setScannedData(data);
        }
    };

    return (
        <div>
            <h1>Barcode Scanner Example</h1>

        </div>
    );
};

export default ScinerPage;
