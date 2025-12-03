"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { ButtonSubmit } from "../button";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface MemberRestoreProps {
  restoreOnSubmit: (reason: string) => void;
  submitted: boolean,
}

export default function MemberRestoreModal({restoreOnSubmit, submitted}: MemberRestoreProps) {
  const [reason, setReason] = useState("");

  return (
    <DialogContent className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg border border-gray-100">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-green-700">
          Restore Account
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Provide a short reason for restoring this student’s account.
        </DialogDescription>
      </DialogHeader>

      <form className="mt-4" onSubmit={(e) => {
        e.preventDefault();
        restoreOnSubmit(reason);
      }}>
        <label className="text-sm font-medium text-gray-700">
          Restoration Reason
        </label>
        <textarea
          placeholder="Enter reason..."
          className="w-full border border-gray-300 rounded-lg p-3 mt-1 
          focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-28"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <DialogFooter className="mt-5 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary" className="rounded-lg">
              Cancel
            </Button>
          </DialogClose>
          <ButtonSubmit props={{
            submitted: submitted,
            buttonType: "submit",
            className: "bg-green-600 hover:bg-green-700 text-white rounded-lg",
            btnText: "Restore",
            btnLoadingText: "Restoring",
          }}
          />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
