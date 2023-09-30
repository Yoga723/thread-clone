"use client";
import React, { ChangeEvent, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Bawaan dari react hook form
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  BtnTitle: string;
}

const AccountProfile = ({ user, BtnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  // Defining jeng make userForm soalna nyesuaiken jeng dokumentasi tina shadcn

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation), // jang nga simplify ?. meh babari nyien skema nu berbeda jang field field dina formna
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    // Mencegah perilaku default dari event.
    e.preventDefault();

    // Membuat objek FileReader untuk membaca konten file.
    const fileReader = new FileReader();

    // Memeriksa apakah ada file yang diunggah.
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Mengubah daftar file (FileList) menjadi array dan menyimpannya.
      setFiles(Array.from(e.target.files));

      // Memastikan file yang diunggah adalah tipe gambar.
      if (!file.type.includes("image")) return;

      // Mendefinisikan aksi setelah gambar selesai dibaca.
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        // Memanggil fungsi callback dengan URL gambar dalam format base64. Hal ini untuk mengubah tampilan frontend gambar dengan gambar baru
        fieldChange(imageDataUrl);
      };

      // Memulai pembacaan file gambar dan konversi ke format base64.
      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo; // valuena string

    const hasImageChanged = isBase64Image(blob); // Cek apakah blob adalah gambar dan apakah user sudah mengganti gambar

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };

  // useEffect(() => {
  //   console.log(files);
  // }, [files]);

  return (
    // {...form} nga spread value object form. {profile_photo, name, ....}
    // Input untuk Images
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)} // Ngirim value object form ka onSubmit function
        className="flex flex-col justify-start gap-10 space-y-8 text-white"
      >
        <FormField
          control={form.control}
          name="profile_photo"  // Name ngambil dari ...form
          render={({ field }: any) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src={"/profile.svg"}
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => {
                    handleImage(e, field.onChange);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input untuk Nama */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Input untuk username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  {...field}
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="border-2 rounded-lg border-white hover:bg-slate-500"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
