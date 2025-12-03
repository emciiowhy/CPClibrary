"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";

interface MemberDeleteModalProps {
  open: boolean;
  onDelete: (reason: string) => void;
  onClose: () => void;
}

export default function MemberDeleteModal({
  open,
  onDelete,
  onClose,
}: MemberDeleteModalProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Reason for deleting this account</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onDelete(reason);
          }}
          className="mt-4"
        >
          <textarea
            placeholder="Enter reason..."
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
