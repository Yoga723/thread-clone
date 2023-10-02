import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser(); // Ngambil data user saat ini dari clerk

  if (!user) return null;
  const result = await fetchPosts(1, 30); //  Masih belum berfungsi secara dinamis
  const userInfo = await fetchUser(user.id); // Ngambil data user dari mongoDb
  if (!userInfo?.onBoarded) redirect("/onboarding");

  return (
    <>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          <>
            {result?.posts.map((post) => {
              return (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || ""}
                  parent={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comment={post.children}
                />
              );
            })}
          </>
        )}
      </section>
    </>
  );
}
