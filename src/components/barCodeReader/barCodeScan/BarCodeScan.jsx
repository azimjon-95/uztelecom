import "./barCodeScan.css";
import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
  const config = {};
  if (props.fps) config.fps = props.fps;
  if (props.qrbox) config.qrbox = props.qrbox;
  if (props.aspectRatio) config.aspectRatio = props.aspectRatio;
  if (props.disableFlip !== undefined) config.disableFlip = props.disableFlip;
  return config;
};

const BarCodeScan = (props) => {
  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === true;

    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is a required callback.");
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);

    html5QrcodeScanner.render((decodedText, decodedResult) => {
      props.qrCodeSuccessCallback(decodedText, decodedResult);

      // Check for a condition to stop the scanner
      if (props.shouldStopScanner && props.shouldStopScanner(decodedText, decodedResult)) {
        try {
          html5QrcodeScanner.clear().catch((error) => {
            console.error("Failed to clear html5QrcodeScanner. ", error);
          });
        } catch (error) {
          console.error("Failed to clear html5QrcodeScanner in try-catch block. ", error);
        }
      }
    }, props.qrCodeErrorCallback);

    return () => {
      try {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      } catch (error) {
        console.error("Failed to clear html5QrcodeScanner in cleanup. ", error);
      }
    };
  }, [props]);

  return <div className="barCodeScan" id={qrcodeRegionId} />;
};

export default BarCodeScan;
