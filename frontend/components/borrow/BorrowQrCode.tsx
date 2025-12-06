"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

interface BorrowQrCodeProps {
  img: string;
}

export default function BorrowQrCode({ img }: BorrowQrCodeProps) {
  return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your QR Code</DialogTitle>
          <DialogDescription>
            Show this QR code to the librarian to claim your borrowed book.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <img
            src={img}
            alt="Borrow QR Code"
            className="w-48 h-48 border rounded-md shadow"
          />
        </div>
      </DialogContent>
  );
}