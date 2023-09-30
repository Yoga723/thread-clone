import ThreadCard from "@/components/cards/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) return redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative ">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parent={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comment={thread.children}
        />
      </div>

      <div className="mt-7 ">
        <Comment
          key={thread._id}
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo?._id) || ""} // _id dari DB mongo db bisa saja sebuah object jadi biar aman di stringify dulu
        />
      </div>

      <div className="mt-10 ">
        {thread.children.map((comment: any) => {
          return (
            <>
              <ThreadCard
                key={comment._id}
                id={comment._id}
                currentUserId={user?.id || ""}
                parent={comment.parentId}
                content={comment.text}
                author={comment.author}
                community={comment.community}
                createdAt={comment.createdAt}
                comment={comment.children}
                isComment
              />
            </>
          );
        })}
      </div>
    </section>
  );
};

export default page;
