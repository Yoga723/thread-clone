"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

interface fetchThreadByIdProps {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    // Update User Model dan memasukkan ID thread yang dibuatnya
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// Didalam sini mengimplementasikan fungsi Pagination
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // Menghitung nomor post untuk di skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetching posts yang tidak ada parentnya (atau bisa dibilang top-level threads)
    const postQuery = Thread.find({
      parentId: { $in: [null, undefined] }, // Cari threads yang tidak punya parent Id atau sebuah komentar lah
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User }) // Populating Parent atau pembuat thread na
      .populate({
        //Populating children atau komentarna
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error) {}
}

export async function fetchThreadById(id: string) {
  connectToDB();

  try {
    // TODO populate juga community
    const thread = await Thread.findById(id)
      .populate({
        path: "author", // path teh ngambil informasi author dari model User, terus milih/select informasi apa yang akan diambil dari author itu
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children", // pathnya children dari thread atau komentar
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    console.error(`Error fetching thread ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: fetchThreadByIdProps) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error(`Error, Thread not Found !`);
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save thread baru. .save() kemungkinan dari mongoose
    const savedCommentThread = await commentThread.save();

    // Update thread parent atau original thread untuk memasukkan comment baru. nga push ka array[] children dina database Thread
    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    // agar refresh dan secara langsung menampilkan hasilnya
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.messange}`);
  }
}
