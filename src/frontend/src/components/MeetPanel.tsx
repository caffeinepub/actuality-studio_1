import { Button } from "@/components/ui/button";
import { PhoneOff, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface MeetPanelProps {
  open: boolean;
  onClose: () => void;
  onRequestLogin: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any;
  }
}

export default function MeetPanel({
  open,
  onClose,
  onRequestLogin,
}: MeetPanelProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [roomName, setRoomName] = useState("actuality-studio");
  const [displayName, setDisplayName] = useState("");
  const [joined, setJoined] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jitsiApiRef = useRef<any>(null);

  // Responsive panel width
  const [panelWidth, setPanelWidth] = useState("clamp(320px, 35vw, 600px)");
  useEffect(() => {
    const update = () =>
      setPanelWidth(
        window.innerWidth < 768 ? "100vw" : "clamp(320px, 35vw, 600px)",
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Load Jitsi script once
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      setApiLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => setApiLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Clean up Jitsi when panel closes
  useEffect(() => {
    if (!open) {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      setJoined(false);
    }
  }, [open]);

  const handleLeave = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    setJoined(false);
  };

  const handleJoin = () => {
    if (!isAuthenticated) {
      onRequestLogin();
      return;
    }
    if (!apiLoaded || !containerRef.current) return;
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }
    const sanitizedRoom =
      roomName.trim().replace(/\s+/g, "-") || "actuality-studio";
    jitsiApiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
      roomName: sanitizedRoom,
      parentNode: containerRef.current,
      width: "100%",
      height: "100%",
      userInfo: {
        displayName: displayName.trim() || "Guest",
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        toolbarButtons: [
          "microphone",
          "camera",
          "desktop",
          "chat",
          "tileview",
          "hangup",
        ],
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
    });
    jitsiApiRef.current.addListener("readyToClose", () => {
      onClose();
    });
    setJoined(true);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          role="button"
          tabIndex={-1}
          className="fixed inset-0 z-[109] bg-black/60"
          style={{ backdropFilter: "blur(3px)" }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close Meet panel"
        />
      )}

      {/* Slide-in panel */}
      <aside
        className="fixed top-0 right-0 h-full z-[110] flex flex-col bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: panelWidth,
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label="Meet panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 bg-background border-b border-border">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-terracotta" />
            <span className="font-display text-lg font-semibold text-foreground">
              Meet
            </span>
          </div>
          <div className="flex items-center gap-2">
            {joined && (
              <button
                type="button"
                data-ocid="meet.secondary_button"
                onClick={handleLeave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
                aria-label="Leave meeting"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave</span>
              </button>
            )}
            <button
              type="button"
              data-ocid="meet.close_button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close Meet panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Setup form (shown before joining) */}
        {!joined && (
          <div className="px-5 py-6 flex flex-col gap-4">
            {!isAuthenticated && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/60 border border-border text-sm font-body text-muted-foreground">
                <Video className="w-4 h-4 mt-0.5 flex-shrink-0 text-terracotta" />
                <span>
                  You'll be asked to sign in with Internet Identity before
                  joining the meeting.
                </span>
              </div>
            )}

            <p className="font-body text-sm text-muted-foreground">
              {isAuthenticated
                ? "Enter a room name and your display name, then click Join."
                : "Enter a room name and display name below."}
            </p>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="meet-room"
                className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Room Name
              </label>
              <input
                id="meet-room"
                type="text"
                data-ocid="meet.input"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. actuality-studio"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="meet-display"
                className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Display Name
              </label>
              <input
                id="meet-display"
                type="text"
                data-ocid="meet.input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name in the meeting"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <Button
              data-ocid="meet.primary_button"
              onClick={handleJoin}
              disabled={!apiLoaded && isAuthenticated}
              className="gradient-terracotta text-primary-foreground font-semibold font-body hover:opacity-90 transition-opacity shadow-warm-sm w-full mt-1"
            >
              <Video className="w-4 h-4 mr-2" />
              {isAuthenticated ? "Join Meeting" : "Sign In & Join"}
            </Button>

            {!apiLoaded && isAuthenticated && (
              <p className="font-body text-xs text-muted-foreground text-center">
                Loading Jitsi…
              </p>
            )}
          </div>
        )}

        {/* Jitsi embed container — always rendered so ref is available */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden"
          style={{
            display: joined ? "flex" : "none",
            flexDirection: "column",
          }}
        />
      </aside>
    </>
  );
}
