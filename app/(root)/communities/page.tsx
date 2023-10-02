import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { profileTabs } from "@/constants";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  //   Fetch Communities
  const result = await fetchCommunities({
    pageNumber: 1,
    searchString: "",
    pageSize: 1,
    sortBy: "desc",
  });

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");
  return (
    <section>
      <h1 className="head-text">Search</h1>

      {/* Search Bar */}
      <div className="mt-14 flex flex-col gap-9 ">
        {result.communities.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.communities.map((community) => {
              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
