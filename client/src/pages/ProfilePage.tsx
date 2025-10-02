import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import useAuth from "../../hooks/useAuth";

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuth();
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      // navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedImg);
    formData.append("fullName", name);
    formData.append("bio", bio);

    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg ">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="cursor-pointer flex items-center gap-3"
          >
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              name="profilePic"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={selectedImg || assets.avatar_icon}
              alt="img"
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
            />
            Upload Profile Image
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="fullName"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Write profile bio"
            value={bio}
            name="bio"
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            selectedImg && "rounded-full"
          }`}
          src={assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
