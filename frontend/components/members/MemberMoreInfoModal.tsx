import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import MemberDeleteModal from "./MemberDeleteModal";
import { toast } from "sonner";
import { Dialog } from "../ui/dialog";

interface Props {
  submitted: boolean;
  studentStatus: string;
  deacOnClick: () => void;
  activateOnClick: () => void;
  deleteOnClick: (reason: string) => void;
}

export default function MemberMoreInfoMenu({
  submitted,
  studentStatus,
  deacOnClick,
  activateOnClick,
  deleteOnClick,
}: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDelete = (reason: string) => {
    deleteOnClick(reason);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="cursor-pointer p-1 hover:bg-gray-100 rounded">
            •••
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {studentStatus === "active" ? (
            <DropdownMenuItem onClick={deacOnClick}>Deactivate</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={activateOnClick}>Activate</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpenDeleteModal(true)} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openDeleteModal && (
        <Dialog>
          <MemberDeleteModal
            onDelete={handleDelete}
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
          />
        </Dialog>
      )}
    </>
  );
}
