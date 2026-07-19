import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import CommunityAPI from "@/api/community/CommunityAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import PageLoader from "@/components/PageLoader";
import InlineError from "@/components/InlineError";

const livekit_url = import.meta.env.VITE_PUBLIC_LIVEKIT_URL;

export default function Call() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const { community, communityLoading } = CommunityAPI();
  const user = useSelector((state: RootState) => state.userDetails.user);

  useEffect(() => {
    const fetchToken = async () => {
      if (!community?.joinCode || !user?.id) return;

      try {
        const res = await api.post(`/community/livekit/get-token`, {
          roomName: community.joinCode,
          identity: user.username,
        });
        setToken(res.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
        setTokenError(true);
      }
    };

    fetchToken();
  }, [community, user?.id]);

  if (tokenError) {
    return <InlineError message="Couldn't start the video call. Please try again." />;
  }

  if (communityLoading || !community?.joinCode || !user?.id || !token) {
    return <PageLoader />;
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
