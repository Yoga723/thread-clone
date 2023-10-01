import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  currentUserId: string;
  parent: string | null;
  content: string;
  author: { name: string; image: string; id: string };
  community: { id: string; name: string; image: string } | null;
  createdAt: string;
  comment: { author: { image: string } }[]; // array[] untuk menandakan akan ada banyak comment bukan satu
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parent,
  content,
  author,
  community,
  createdAt,
  comment,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 sm:px-7 " : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4 ">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.id}`}
              className={`relative h-11 w-11`}
            >
              <Image
                src={author.image}
                alt={"Profile Images"}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link
              href={`/profile/${author.id}`}
              className={`w-fit`}
            >
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className={`mt-2 text-small-regular text-light-2`}>{content}</p>
            <div className={`${isComment && "mb-10"}mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src={"heart-gray.svg"}
                  alt="Heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"reply.svg"}
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src={"repost.svg"}
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"share.svg"}
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comment.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comment.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div>
          {/* TODO : Delete Thread */}
          {/* TODO : Show comment Logos */}

          {!isComment && community && (
            <Link
              href={`/communities/${community.id}`}
              className="mt-5 flex items-center"
            >
              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)}- {community.name} Community
              </p>
              <Image
                src={community.image}
                alt={community.name}
                width={14}
                height={14}
                className="ml-1 rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
