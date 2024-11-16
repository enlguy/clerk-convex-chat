"use client";

import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {};

const createGroupFormSchema = z.object({
  name: z.string().min(1, { message: "This field cannot be blank" }),
  members: z
    .string()
    .array()
    .min(1, { message: "You must select at least one friend" }),
});

const CreateGroupDialog = (props: Props) => {
  const friends = useQuery(api.friends.get);

  const { mutate: createGroup, pending } = useMutationState(
    api.conversation.createGroup,
  );

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);

  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : [];
  }, [members.length, friends?.length]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>,
  ) => {
    await createGroup({ name: values.name, members: values.members })
      .then(() => {
        form.reset();
        toast.success("Group created!");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred",
        );
      });
  };

  return <div>CreateGroupDialog</div>;
};

export default CreateGroupDialog;
