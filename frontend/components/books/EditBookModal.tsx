"use client";
import {
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ButtonSubmit } from "../button";

interface EditBookTypes {
  bookImage: File | string | null;
  description: string;
  author: string;
  category: string;
  year: string;
  copies: number;
  onChangeBookImage: (value: File | null) => void;
  onChangeDescription: (value: string) => void;
  onChangeAuthor: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeYear: (value: string) => void;
  onChangeCopies: (value: number) => void;
  onSubmit: () => Promise<boolean>;
  submitProcess: boolean;
  onClose?: () => void;
}

export default function EditBookModal({
  bookImage,
  description,
  author,
  category,
  year,
  copies,
  onChangeBookImage,
  onChangeDescription,
  onChangeAuthor,
  onChangeCategory,
  onChangeYear,
  onChangeCopies,
  onSubmit,
  submitProcess,
  onClose,
}: EditBookTypes) {
  // Determine the preview image URL
  const previewUrl =
    bookImage instanceof File
      ? URL.createObjectURL(bookImage)
      : typeof bookImage === "string"
      ? bookImage
      : null;

  return (
    <DialogContent className="max-w-sm rounded-xl p-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-black">
          Edit Book
        </DialogTitle>
        <DialogDescription className="text-gray-700">
          Update the details of the book.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 mt-3">
        {/* Book Image Upload */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="picture">Book Photo</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) =>
              onChangeBookImage(
                (e.target as HTMLInputElement).files?.[0] || null
              )
            }
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-1">
          <Label className="text-black">Description</Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="w-full border-gray-400 focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Author */}
        <div className="flex flex-col space-y-1">
          <Label className="text-black">Author</Label>
          <Input
            type="text"
            value={author}
            onChange={(e) => onChangeAuthor(e.target.value)}
            className="w-full border-gray-400 focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-1">
          <Label className="text-black">Category</Label>
          <Input
            type="text"
            value={category}
            onChange={(e) => onChangeCategory(e.target.value)}
            placeholder="BSIT, BSED, etc."
            className="w-full border-gray-400 focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Release Year */}
        <div className="flex flex-col space-y-1">
          <Label className="text-black">Release Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => onChangeYear(e.target.value)}
            className="w-full border-gray-400 focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Copies */}
        <div className="flex flex-col space-y-1">
          <Label className="text-black">Copies</Label>
          <Input
            type="number"
            value={copies}
            onChange={(e) => onChangeCopies(Number(e.target.value))}
            className="w-full border-gray-400 focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      <DialogFooter className="mt-4 flex flex-col gap-2">
        <DialogClose asChild>
          <Button variant="outline" className="text-black border-gray-500">
            Close
          </Button>
        </DialogClose>

        <ButtonSubmit
          props={{
            btnOnClick: async () => {
              const success = await onSubmit();
              if (success) onClose?.();
            },
            className: "rounded-lg bg-black hover:bg-gray-900 text-white w-full",
            type: "button",
            submitted: submitProcess,
            btnText: "Save Changes",
            btnLoadingText: "Saving...",
          }}
        />
      </DialogFooter>
    </DialogContent>
  );
}
