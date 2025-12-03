"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { ButtonSubmit } from "../button";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useState } from "react";

interface BorrowMoreProps {
  extendSubmitted: boolean,
  borrowedSubmitted: boolean,
  returnedSubmitted: boolean,
  overdueSubmitted: boolean,

  BorrowedOnClick: () => void,
  ReturnedOnClick: () => void,
  OverdueOnClick: () => void,

  dueDateValue: string,
  onDueDateChange: (value: string) => void,
  ExtendOnClick: () => void,

  penaltyValue: number,
  isOverDue: boolean
}

export default function BorrowMoreModal({isOverDue, penaltyValue, extendSubmitted ,borrowedSubmitted, returnedSubmitted, overdueSubmitted, BorrowedOnClick, ReturnedOnClick, OverdueOnClick, dueDateValue, onDueDateChange, ExtendOnClick, }: BorrowMoreProps) {
  return (
    <div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>More Info</DialogTitle>

          <DialogDescription>
            Edit student status or manage penalties.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm font-semibold">
              Set students borrow status
            </h1>
            <div className="flex justify-between">
              <ButtonSubmit
                props={{
                  submitted: borrowedSubmitted,
                  buttonType: "submit",
                  className:
                    "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
                  btnText: "Set To Borrowed",
                  btnLoadingText: "Setting To Borrowed",
                  btnOnClick: BorrowedOnClick
                }}
              />

              <ButtonSubmit
                props={{
                  submitted: returnedSubmitted,
                  buttonType: "submit",
                  className:
                    "bg-green-600 hover:bg-green-700 text-white rounded-lg",
                  btnText: "Set To Returned",
                  btnLoadingText: "Setting To Returned",
                  btnOnClick: ReturnedOnClick
                }}
              />

              <ButtonSubmit
                props={{
                  submitted: overdueSubmitted,
                  buttonType: "submit",
                  className:
                    "bg-red-600 hover:bg-red-700 text-white rounded-lg",
                  btnText: "Set To Overdue",
                  btnLoadingText: "Setting To Overdue",
                  btnOnClick: OverdueOnClick
                }}
              />
            </div>
          </div>

          <hr />

          <div>
            <h1 className="text-sm font-semibold">Extend Due Date</h1>
            <div className="flex gap-4">
              <Input 
                placeholder="Input days to extend" 
                type="date" 
                className="w-fit"
                value={dueDateValue}
                onChange={(e) => onDueDateChange(e.target.value)}
              />

              <ButtonSubmit
                props={{
                  submitted: extendSubmitted,
                  buttonType: "submit",
                  className:
                    "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg",
                  btnText: "Extend",
                  btnLoadingText: "Extending",
                  btnOnClick: ExtendOnClick,
                }}
              />
            </div>
          </div>

          {
            isOverDue &&
            <div>
            <h1 className="font-semibold text-red-600">Penalty</h1>
            <p className="font-semibold text-red-600">₱{penaltyValue}</p>
          </div>
          }
        </div>


        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="rounded-lg">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
