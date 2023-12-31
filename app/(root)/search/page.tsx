import UserCard from "@/components/cards/UserCard";
import Search from "@/components/forms/Search";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;
  

  //   Fetch Users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");
  return (
    <section>
      <h1 className="head-text">Search</h1>

      <Search partOf={"SearchUsers"}/>

      {/* Search Bar */}
      <div className="mt-14 flex flex-col gap-9 ">
        {result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.users.map((person) => {
              return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
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
