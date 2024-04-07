"use client";

import { type quillRouter } from "@/server/api/routers/quill";
import { type inferRouterOutputs } from "@trpc/server";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/trpc/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type RoomsListProps = {
  roomsList: inferRouterOutputs<typeof quillRouter>["getRooms"];
};

export default function RoomsList({ roomsList }: RoomsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: createRoom } = api.quill.createRoom.useMutation();
  const [createRoomFormData, setCreateRoomFormData] = useState({
    roomName: "",
    inputs: 1,
  });

  const onSubmit = async () => {
    if (!createRoomFormData.roomName) return;
    const newRoom = await createRoom({
      name: createRoomFormData.roomName,
      numOfInputs: createRoomFormData.inputs,
    });
    router.push(`/quill/${newRoom.id}`);
    router.refresh();
  };

  return (
    <nav className="mr-3 flex flex-1 flex-col" aria-label="Sidebar">
      <div className="mb-4">
        <label
          htmlFor="room-name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Enter name and no. of inputs
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="room-name"
            id="room-name"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Room name"
            value={createRoomFormData.roomName}
            onChange={(e) =>
              setCreateRoomFormData({
                ...createRoomFormData,
                roomName: e.target.value,
              })
            }
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="inputs" className="sr-only">
              Number of inputs
            </label>
            <select
              id="inputs"
              name="inputs"
              className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              value={createRoomFormData.inputs}
              onChange={(e) =>
                setCreateRoomFormData({
                  ...createRoomFormData,
                  inputs: parseInt(e.target.value),
                })
              }
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
          onClick={onSubmit}
        >
          Create Room
        </button>
      </div>
      <ul role="list" className="-mx-2 space-y-1">
        {roomsList.map((room) => (
          <li key={room.id}>
            <a
              href={`/quill/${room.id}`}
              className={classNames(
                room.id === pathname?.split("/")[2]
                  ? "bg-gray-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "group flex gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6",
              )}
            >
              {room.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
