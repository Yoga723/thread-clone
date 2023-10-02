import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  // Fetch Profile and community tab

  let result: any;

  if (accountType === "User") {
    result = await fetchUserPosts(accountId);
  } else if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  }

  if (!result) return redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={""}
            parent={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            } // Update Bagian ini
            community={thread.community}
            createdAt={thread.createdAt}
            comment={thread.children}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
