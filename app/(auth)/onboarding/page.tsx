import { currentUser } from "@clerk/nextjs";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  const userInfo = {};  // Didapatkan dari Clerk
  const userData = {  // Dari database MongoDB
    id: user?.id, // ID user dari database clerk
    objectId: userInfo?._id,  // ID user dari database mongodb
    username: userInfo?.username || user?.username || "",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl || ""
  };
  return (
    <main className="flex flex-col max-w-3xl mx-auto justify-start px-10 py-20">
      <h1 className="head-text">On Boarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads !
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} BtnTitle="Continue"/>
      </section>
    </main>
  );
}

export default Page;
