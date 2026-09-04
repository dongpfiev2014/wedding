"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/ui/Header";
import MusicPlayer from "@/components/ui/MusicPlayer";
import EnvelopeOpener from "@/components/sections/EnvelopeOpener";
import SaveTheDate from "@/components/sections/SaveTheDate";
import InvitationCard from "@/components/sections/InvitationCard";

import Countdown from "@/components/sections/Countdown";
import Journey from "@/components/sections/Journey";
import Memories from "@/components/sections/Memories";
import GuestBook from "@/components/sections/GuestBook";
import WeddingGift from "@/components/sections/WeddingGift";
import ThankYou from "@/components/sections/ThankYou";

export default function HomePage() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {});
  }, []);

  return (
    <ThemeProvider>
      {/* Envelope opener overlay */}
      {!envelopeOpened && (
        <EnvelopeOpener onOpen={() => setEnvelopeOpened(true)} />
      )}

      {/* Main site */}
      <div style={{ opacity: envelopeOpened ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <Header />
        <MusicPlayer musicUrl={settings.musicUrl} />
        <main>
          <SaveTheDate settings={settings} />
          <InvitationCard settings={settings} />
          <Countdown />
          <Journey />
          <Memories />
          <GuestBook />
          <WeddingGift settings={settings} />
        </main>
        <ThankYou settings={settings} />
      </div>
    </ThemeProvider>
  );
}
