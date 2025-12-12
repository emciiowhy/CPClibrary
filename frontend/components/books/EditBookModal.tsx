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
  return (
    <DialogContent className="max-w-4xl w-full rounded-xl p-6">
      <DialogHeader className="mb-4">
        <DialogTitle className="text-2xl font-semibold text-black">
          Edit Book
        </DialogTitle>
        <DialogDescription className="text-gray-700">
          Update the details of the book.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Book Image */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <Label htmlFor="picture" className="mb-2">Book Photo</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) =>
              onChangeBookImage((e.target as HTMLInputElement).files?.[0] || null)
            }
            className="mb-4"
          />
          {bookImage && (
            <img
              src={
                typeof bookImage === "string"
                  ? bookImage
                  : URL.createObjectURL(bookImage)
              }
              alt="Preview"
              className="w-48 h-48 object-cover rounded"
            />
          )}
        </div>

        {/* Right Column - Form Fields */}
        <div className="flex flex-col w-full md:w-2/3 gap-4">
          <div className="flex flex-col">
            <Label className="text-black">Description</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              className="w-full border-gray-400 focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-black">Author</Label>
            <Input
              type="text"
              value={author}
              onChange={(e) => onChangeAuthor(e.target.value)}
              className="w-full border-gray-400 focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-black">Category</Label>
            <Input
              type="text"
              value={category}
              onChange={(e) => onChangeCategory(e.target.value)}
              placeholder="BSIT, BSED, etc."
              className="w-full border-gray-400 focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-1/2">
              <Label className="text-black">Release Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => onChangeYear(e.target.value)}
                className="w-full border-gray-400 focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <Label className="text-black">Copies</Label>
              <Input
                type="number"
                value={copies}
                onChange={(e) => onChangeCopies(Number(e.target.value))}
                className="w-full border-gray-400 focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6 flex flex-col md:flex-row gap-4 justify-end">
        <DialogClose asChild>
          <Button variant="outline" className="text-black border-gray-500 w-full md:w-auto">
            Close
          </Button>
        </DialogClose>

        <ButtonSubmit
          props={{
            btnOnClick: async () => {
              const success = await onSubmit();
              if (success) onClose?.();
            },
            className: "rounded-lg bg-black hover:bg-gray-900 text-white w-full md:w-auto",
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
