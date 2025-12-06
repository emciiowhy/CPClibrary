"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";

export interface ScanBorrowQrHandles {
  startScanner: () => void;
  clearScanner: () => void;
}

interface ScanBorrowQrProps {
  onScan?: (data: any) => void;
}

const ScanBorrowQr = forwardRef<ScanBorrowQrHandles, ScanBorrowQrProps>(
  ({ onScan }, ref) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);

const startScanner = async () => {
  if (scannerRef.current) return;

  const scanner = new Html5Qrcode("qr-reader");
  scannerRef.current = scanner;

  try {
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        toast.success("QR scanned!");

        // Stop scanner immediately to prevent repeated scans
        await scanner.stop();
        scanner.clear();
        scannerRef.current = null;

        try {
          const response = await api.post("/api/books/scan-borrow-qr", {
            qr_data: decodedText,
          });

          toast.success(response.data.message);
          window.location.reload();
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Scan error");
        }
      },
      () => {} // optional failure callback
    );
  } catch (err) {
    toast.error("Camera failed to start");
    scannerRef.current = null;
  }
};



    const clearScanner = () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        });
      }
    };

    useEffect(() => {
      if (scannerRef.current?.start) {

      }
    }, [scannerRef])

    useImperativeHandle(ref, () => ({
      startScanner,
      clearScanner,
    }));

    return (
      <DialogContent className="w-[350px] h-[450px] flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            Scan Borrow QR Code
          </DialogTitle>
          <DialogDescription>
            Point your camera at the QR code to mark pending items as borrowed.
          </DialogDescription>
        </DialogHeader>

        <div id="qr-reader" style={{ width: 300, height: 300 }}></div>

        <DialogFooter>
          <DialogClose asChild>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }
);

ScanBorrowQr.displayName = "ScanBorrowQr";

export default ScanBorrowQr;
