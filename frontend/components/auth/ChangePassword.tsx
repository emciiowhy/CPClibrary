"use client"
import {
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ButtonSubmit } from "../button"

interface ChangePasswordTypes {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  onChangeCurrent: (value: string) => void
  onChangeNew: (value: string) => void
  onChangeConfirm: (value: string) => void
  onSubmit: () => Promise<boolean>
  submitChangePass: boolean
  onClose?: () => void
}

export default function ChangePassword({
  currentPassword,
  newPassword,
  confirmNewPassword,
  onChangeCurrent,
  onChangeNew,
  onChangeConfirm,
  onSubmit,
  submitChangePass,
  onClose
}: ChangePasswordTypes) {
  return (
    <DialogContent className="max-w-md rounded-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-indigo-700">
          Change Password
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Enter your current and new password to update your account.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        <div className="flex flex-col space-y-1">
          <Label className="text-indigo-700">Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => onChangeCurrent(e.target.value)}
            className="w-full border-indigo-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="text-indigo-700">New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => onChangeNew(e.target.value)}
            className="w-full border-indigo-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="text-indigo-700">Confirm New Password</Label>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => onChangeConfirm(e.target.value)}
            className="w-full border-indigo-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <DialogFooter className="mt-6 flex flex-col gap-2">
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>

        <ButtonSubmit
          props={{
          btnOnClick: async () => {
            const success = await onSubmit(); // await the promise
            if (success) onClose?.(); // safely close dialog if success
          },
          className: "rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white w-full",
          type: "button",
          submitted: submitChangePass,
          btnText: "Save Changes",
          btnLoadingText: "Saving Changes"
          }}
        />
      </DialogFooter>
    </DialogContent>
  )
}
