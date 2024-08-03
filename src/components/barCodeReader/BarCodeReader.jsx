import { useState } from "react";
import "./barCodeReader.css";
import BarCodeScan from "./barCodeScan/BarCodeScan";

function BarCodeReader() {

  let [id, setId] = useState("");
  const onNewScanResult = (decodedText, decodedResult) => {
    setId(decodedText);
  };


  return (
    <div className="barCodeReader">
      {!id ? (
        <BarCodeScan
          fps={10}
          qrbox={450}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
          id={id}
        />
      ) : (
        <div className="scanned">
          <p>Barcode:{id}</p>
        </div>
      )}
      <h1>{id}</h1>
    </div>
  );
}

export default BarCodeReader;
