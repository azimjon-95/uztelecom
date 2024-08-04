import React, { useState } from "react";
import "./barCodeReader.css";
import BarCodeScan from "./barCodeScan/BarCodeScan";

function BarCodeReader() {
  const [id, setId] = useState("");

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("OK");
    setId(decodedText);
    console.log(decodedText, decodedResult);
  };

  return (
    <div className="barCodeReader">
      {!id ? (
        <BarCodeScan
          fps={10}
          qrbox={450}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
          shouldStopScanner={() => !!id}
        />
      ) : (
        <div className="scanned">
          <p>Barcode: {id}</p>
        </div>
      )}
      <h1>{id}</h1>
    </div>
  );
}

export default BarCodeReader;

