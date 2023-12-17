"use client";
import React from "react";
import { Input } from "../ui/input";
import { fetchUsers } from "@/lib/actions/user.actions";

const Search = ({ partOf }: any) => {
  const searchInput = async (e: any) => {
    if (partOf === "SearchUsers") {
      await fetchUsers({ searchString: e.target.value });
    }
  };

  console.log(partOf);
  return (
    <div className="">
      <Input
        type="text"
        placeholder="Search User"
        className="account-form_image-input"
        onChange={(e) => {
          searchInput(e);
        }}
      />
    </div>
  );
};

export default Search;
