import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Image,
} from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

function Home() {
  const [profile, setProfile] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("https://faisal-portfolio-backend.vercel.app/api/profile");
        if (response.status === 200 && Array.isArray(response.data.data)) {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    }

    fetchProfile();
  }, []);

  const openModal = (profile) => {
    setSelectedProfile(profile);
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      setAvatar(files[0]);
    } else {
      setSelectedProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onUpdate = async () => {
    if (!selectedProfile) return;

    const formData = new FormData();
    Object.keys(selectedProfile).forEach((key) => {
      if (key !== "avatar") {
        formData.append(key, selectedProfile[key]);
      }
    });

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await axios.put(
        `https://faisal-portfolio-backend.vercel.app/api/profile/${selectedProfile._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Profile Updated Successfully");
        setProfile(
          profile.map((p) =>
            p._id === selectedProfile._id ? selectedProfile : p
          )
        );
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong. Could not update the profile.");
    }
  };

  return (
    <>
      <div className="p-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg">
        <div className="text-center">
          {profile.map((data) => (
            <div key={data._id}>
              <img
                src={data.avatar || "default-avatar.png"}
                alt="Profile"
                className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-teal-500"
              />
              <h2 className="text-4xl font-bold mb-2 text-white">
                {data.name}
              </h2>
              <p className="text-lg mb-4 text-white">{data.description}</p>
              <Button
                onClick={() => openModal(data)}
                color="gradient"
                className="text-white"
              >
                <FaEdit /> Edit
              </Button>
            </div>
          ))}
        </div>

        {/* Modal for Editing Profile */}
        {selectedProfile && (
          <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
            <ModalContent>
              <ModalHeader>Edit Profile</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  name="name"
                  value={selectedProfile.name}
                  onChange={handleInputChange}
                />
                <Textarea
                  label="Description"
                  name="description"
                  value={selectedProfile.description}
                  onChange={handleInputChange}
                />
                <Image
                  alt={selectedProfile.name}
                  src={selectedProfile.avatar}
                  width={270}
                  className="object-cover rounded-xl"
                />
                <input type="file" name="avatar" onChange={handleInputChange} />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="error" onPress={onClose}>
                  Close
                </Button>
                <Button color="gradient" onPress={onUpdate}>
                  Save Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </div>
    </>
  );
}

export default Home;
