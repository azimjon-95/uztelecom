import React, { useEffect, useState } from "react";
import "./barCodeReader.css";
import BarCodeScan from "./barCodeScan/BarCodeScan";
import CustomLayout from "../layout/Layout";

function BarCodeReader() {
  let [id, setId] = useState("");
  let getData = (id) => {
    console.log(id);
    // fetch data
  };

  return (
    <div className="barCodeReader">
      {!id ? (
        <BarCodeScan
          fps={10}
          qrbox={450}
          disableFlip={false}
          qrCodeSuccessCallback={(decodedText, decodedResult) => {
            if (id === "") {
              getData(decodedText);
              setId(decodedText);
            }
          }}
          shouldStopScanner={() => !!id}
        />
      ) : (
        <CustomLayout>
          <h1>Loading...</h1>
        </CustomLayout>
      )}
    </div>
  );
}

export default BarCodeReader;
