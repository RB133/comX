import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import axios from "axios";
import CommunityAPI from "@/api/community/CommunityAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

const backend_url = import.meta.env.VITE_BACKEND_URL;
const livekit_url = import.meta.env.VITE_PUBLIC_LIVEKIT_URL;

export default function Call() {
  const [token, setToken] = useState<string | null>(null);
  const { community, communityLoading } = CommunityAPI();
  const user = useSelector((state: RootState) => state.userDetails.user);

  useEffect(() => {
    const fetchToken = async () => {
      if (!community?.joinCode || !user?.id) return;

      try {
        const res = await axios.post(
          `${backend_url}/community/livekit/get-token`,
          {
            roomName: community.joinCode,
            identity: user.username,
          },
          {
            withCredentials: true,
          }
        );
        setToken(res.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    fetchToken();
  }, [community, user?.id]);

  if (communityLoading || !community?.joinCode || !user?.id) {
    return <div>Loading video call...</div>;
  }

  if (!token) {
    return <div>Authorizing...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekit_url}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
