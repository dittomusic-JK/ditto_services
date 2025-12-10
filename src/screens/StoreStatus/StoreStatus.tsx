import React from "react";

interface Store {
  id: string;
  name: string;
  icon: string;
  status: "sent" | "rejected";
  statusColor: string;
}

interface AvailableStore {
  id: string;
  name: string;
  icon: string;
  moreInfo: string;
}

type Plan = "Starter" | "Pro" | "Label" | "DittoPlusRLS";

type FeatureId = "autoRelease" | "ytContentId" | "beatport" | "audioFingerprint";

interface FeatureConfig {
  id: FeatureId;
  title: string;
  description?: string;
}

const FEATURES: FeatureConfig[] = [
  {
    id: "autoRelease",
    title: "Auto-release to new platforms",
    description: "Automatically send this release to any new platforms we add.",
  },
  {
    id: "ytContentId",
    title: "YouTube Content ID & Shorts",
    description: "Protect and monetize your music on YouTube and Shorts.",
  },
  {
    id: "beatport",
    title: "Beatport distribution & label setup",
    description: "Distribute to Beatport and set up your label profile.",
  },
  {
    id: "audioFingerprint",
    title: "Audio fingerprint",
    description: "Detect and match uses of your audio across supported platforms.",
  },
];

const CURRENT_PLAN: Plan = "Starter";

const Toggle: React.FC<{ enabled: boolean; disabled?: boolean }> = ({
  enabled,
  disabled,
}) => (
  <div
    className={`relative w-10 h-5 rounded-full flex items-center ${
      enabled
        ? "bg-ditto-colors-light-dark-ditto-purple"
        : "bg-ditto-colors-light-dark-ditto-border-grey"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-default"}`}
  >
    <div
      className={`absolute w-4 h-4 rounded-full bg-white shadow top-0.5 transition-all ${
        enabled ? "right-1" : "left-1"
      }`}
    />
  </div>
);

interface RowState {
  visible: boolean;
  enabled: boolean;
  disabled: boolean;
  badge: string;
  helper?: string;
}

function getRowState(plan: Plan, featureId: FeatureId): RowState {
  const base: RowState = {
    visible: true,
    enabled: false,
    disabled: false,
    badge: "",
  };

  switch (featureId) {
    case "autoRelease": {
      if (plan === "DittoPlusRLS") {
        return { ...base, visible: false };
      }
      if (plan === "Starter") {
        return {
          visible: true,
          enabled: false,
          disabled: true,
          badge: "Included with Pro",
          helper: "Upgrade to Pro to enable auto-release to new platforms.",
        };
      }
      if (plan === "Pro") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Pro",
        };
      }
      return {
        visible: true,
        enabled: true,
        disabled: false,
        badge: "Included with Label",
      };
    }

    case "ytContentId": {
      if (plan === "Starter") {
        return {
          visible: true,
          enabled: false,
          disabled: true,
          badge: "Included with Pro",
          helper: "Upgrade to Pro to access YouTube Content ID & Shorts.",
        };
      }
      if (plan === "Pro") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Pro",
        };
      }
      if (plan === "Label") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Label",
        };
      }
      return {
        visible: true,
        enabled: true,
        disabled: false,
        badge: "Included with Ditto+ RLS",
      };
    }

    case "beatport": {
      if (plan === "DittoPlusRLS") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Ditto+ RLS",
        };
      }
      return {
        visible: true,
        enabled: false,
        disabled: true,
        badge: "Available with Ditto+ RLS",
      };
    }

    case "audioFingerprint": {
      if (plan === "Starter") {
        return {
          visible: true,
          enabled: false,
          disabled: true,
          badge: "Included with Pro",
          helper:
            "Not a paid add-on. Available on Pro, Label and Ditto+ RLS.",
        };
      }
      if (plan === "Pro") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Pro (no extra cost)",
        };
      }
      if (plan === "Label") {
        return {
          visible: true,
          enabled: true,
          disabled: false,
          badge: "Included with Label (no extra cost)",
        };
      }
      return {
        visible: true,
        enabled: true,
        disabled: false,
        badge: "Included with Ditto+ RLS (no extra cost)",
      };
    }

    default:
      return base;
  }
}

const DistributionOptions: React.FC<{ plan: Plan }> = ({ plan }) => {
  return (
    <section className="absolute top-[1100px] left-32 w-[1016px] rounded-xl border border-ditto-colors-light-dark-ditto-border-grey bg-white px-6 py-5 flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-[18px] leading-5 font-semibold [font-family:'Poppins',Helvetica] text-ditto-colors-light-dark-ditto-text-fill">
            Distribution options
          </h2>
          <p className="mt-1 text-xs leading-[16px] text-ditto-colors-light-dark-ditto-subtext-grey [font-family:'Satoshi-Regular',Helvetica]">
            Control extra distribution services for this release based on your
            plan.
          </p>
        </div>
        <span className="text-xs text-ditto-colors-light-dark-ditto-subtext-grey [font-family:'Satoshi-Regular',Helvetica]">
          Current plan:{" "}
          <span className="font-medium text-ditto-colors-light-dark-ditto-text-fill">
            {plan === "DittoPlusRLS" ? "Ditto+ RLS" : plan}
          </span>
        </span>
      </div>

      <div className="flex flex-col divide-y divide-ditto-colors-light-dark-ditto-border-grey">
        {FEATURES.map((feature) => {
          const state = getRowState(plan, feature.id);
          if (!state.visible) return null;

          return (
            <div
              key={feature.id}
              className="flex items-start justify-between py-3 gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium [font-family:'Satoshi-Regular',Helvetica] text-ditto-colors-light-dark-ditto-text-fill">
                    {feature.title}
                  </span>
                  {state.badge && (
                    <span className="inline-flex items-center px-2 py-[2px] rounded-full border border-ditto-colors-light-dark-ditto-border-grey text-[10px] leading-[12px] uppercase tracking-[0.04em] [font-family:'Satoshi-Regular',Helvetica] text-ditto-colors-light-dark-ditto-subtext-grey bg-ditto-colors-light-dark-ditto-light-grey">
                      {state.badge}
                    </span>
                  )}
                </div>
                {feature.description && (
                  <p className="mt-1 text-xs leading-[16px] text-ditto-colors-light-dark-ditto-subtext-grey [font-family:'Satoshi-Regular',Helvetica]">
                    {feature.description}
                  </p>
                )}
                {state.helper && (
                  <p className="mt-1 text-[11px] leading-[14px] text-ditto-colors-light-dark-ditto-subtext-grey [font-family:'Satoshi-Regular',Helvetica]">
                    {state.helper}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Toggle enabled={state.enabled} disabled={state.disabled} />
                {state.disabled && (
                  <span className="text-[11px] leading-[14px] text-ditto-colors-light-dark-ditto-subtext-grey [font-family:'Satoshi-Regular',Helvetica]">
                    Upgrade to change this setting
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const StoreStatus = (): JSX.Element => {
  const stores: Store[] = [
    {
      id: "spotify",
      name: "Spotify",
      icon: "/img/spotify-icon.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "apple-music",
      name: "Apple Music",
      icon: "/img/apple-music.png",
      status: "rejected",
      statusColor: "var(--ditto-colors-light-dark-ditto-red)",
    },
    {
      id: "shazam",
      name: "Shazam",
      icon: "/img/spotify-icon-1.png",
      status: "rejected",
      statusColor: "var(--ditto-colors-light-dark-ditto-red)",
    },
    {
      id: "itunes",
      name: "iTunes",
      icon: "/img/rectangle-951.png",
      status: "rejected",
      statusColor: "var(--ditto-colors-light-dark-ditto-red)",
    },
    {
      id: "amazon",
      name: "Amazon",
      icon: "/img/spotify-icon-2.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "/img/instagram-logo-2022-1.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "/img/rectangle-992.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "iheartradio",
      name: "iHeartRadio",
      icon: "/img/spotify-icon-3.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "pandora",
      name: "Pandora",
      icon: "/img/spotify-icon-4.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "rdio",
      name: "Rdio",
      icon: "/img/spotify-icon-5.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "deezer",
      name: "Deezer",
      icon: "/img/frame-4775.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "tidal",
      name: "Tidal",
      icon: "/img/spotify-icon-6.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "/img/spotify-icon-7.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "youtube-music",
      name: "Youtube Music",
      icon: "/img/spotify-icon-8.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "claro-musica",
      name: "Claro Musica",
      icon: "/img/claro-musica-icon.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "joox-1",
      name: "Joox",
      icon: "/img/group-4761.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "joox-2",
      name: "Joox",
      icon: "/img/group-4696.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "napster",
      name: "Napster",
      icon: "/img/image-10.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "saavn",
      name: "Saavn",
      icon: "/img/image-11.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "boomplay",
      name: "Boomplay",
      icon: "/img/rectangle-1031.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "huawei",
      name: "Huawei",
      icon: "/img/soundtrackyourbrand-2.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "awa",
      name: "Awa",
      icon: "/img/rectangle-1019.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "resso",
      name: "Resso",
      icon: "/img/anghami-icon-1.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "peloton",
      name: "Napster",
      icon: "/img/peloton-icon-1.svg",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "huawei-2",
      name: "Huawei",
      icon: "/img/image-13.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "saavn-2",
      name: "Saavn",
      icon: "/img/image-25.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "saavn-3",
      name: "Saavn",
      icon: "/img/saavn-3.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "joox-3",
      name: "Joox",
      icon: "/img/image-17.png",
      status: "sent",
      statusColor: "#00ad68",
    },
    {
      id: "resso-2",
      name: "Resso",
      icon: "/img/resso-icon.png",
      status: "sent",
      statusColor: "#00ad68",
    },
  ];

  const availableStores: AvailableStore[] = [
    {
      id: "joox-available",
      name: "Joox",
      icon: "/img/joox-4.png",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "twitch",
      name: "Twitch Soundtrack",
      icon: "/img/rectangle-1047.png",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "music-island",
      name: "Music Island",
      icon: "/img/boomplay-icon.png",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "melon",
      name: "Melon",
      icon: "/img/image-4.png",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "bugs-music",
      name: "Bugs Music",
      icon: "/img/bugs.png",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "genie-music",
      name: "Genie Music",
      icon: "/img/path-9763.svg",
      moreInfo: "/img/more-information-6.png",
    },
    {
      id: "naver",
      name: "Naver",
      icon: "/img/rectangle-1044.png",
      moreInfo: "/img/more-information-6.png",
    },
  ];

  const navigationItems = [
    { name: "Artists", icon: "/img/artists.png", width: "w-[42.06px]" },
    { name: "Music", icon: "/img/music.png", width: "w-[38.85px]" },
    { name: "Videos", icon: "/img/videos.png", width: "w-[46.66px]" },
    { name: "Royalties", icon: "/img/royalties.png", width: "w-[59.07px]" },
    { name: "Analytics", icon: "/img/analytics.png", width: "w-[61.22px]" },
    { name: "Promotion", icon: "/img/promotion.png", width: "w-[70.43px]" },
    { name: "Publishing", icon: "/img/publishing.png", width: "w-[70.03px]" },
  ];

  const tabs = [
    { name: "Overview", active: false },
    { name: "Stores", active: true },
    { name: "Extras", active: false },
    { name: "Royalty Splits", active: false },
  ];

  return (
    <div
      className="bg-ditto-colors-light-dark-ditto-background-white w-full min-w-[1280px] min-h-[2452px] relative"
      data-ditto-colors-light-dark-mode="light"
      data-model-id="7856:21134"
    >
<img
        className="absolute top-0 left-[802px] w-px h-[74px]"
        alt="Vector"
        src="/img/vector-2.svg"
      />
<header className="flex w-[1280px] items-center justify-between px-12 py-4 absolute top-0 left-0 border-b [border-bottom-style:solid] border-ditto-colors-light-dark-ditto-border-grey">
<nav className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
<img
            className="relative w-[102.87px] h-[21.39px]"
            alt="Logo black"
            src="/img/logo-2048-black.png"
          />
{navigationItems.map((item, index) => (
            <img
              key={index}
              className={`relative ${item.width} h-[11.71px]`}
              alt={item.name}
              src={item.icon}
            />
))}
        </nav>
<div className="inline-flex items-center gap-[18px] relative flex-[0_0_auto]">
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 relative flex-[0_0_auto] bg-ditto-colors-light-dark-ditto-pro-green rounded">
<span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Satoshi-Regular',Helvetica] font-normal text-ditto-colors-light-dark-ditto-text-fill text-xs tracking-[0] leading-[14px] whitespace-nowrap">
Upgrade
            </span>
</button>
<div className="relative w-6 h-6 bg-[url(/img/path-3072.svg)] bg-[100%_100%]">
<img
              className="absolute top-[5px] left-2 w-2 h-[11px]"
              alt="Path"
              src="/img/path-3073.svg"
            />
<div className="absolute top-4 left-2.5 w-1 h-1 bg-ditto-colors-light-dark-ditto-subtext-grey rounded-[1px]" />
</div>
<img
            className="relative w-6 h-6"
            alt="Shopping basket"
            src="/img/shopping-basket.svg"
          />
<button className="inline-flex items-center gap-1.5 px-6 py-3 relative flex-[0_0_auto] bg-ditto-colors-light-dark-ditto-purple rounded-[32px] border border-solid border-ditto-colors-light-dark-ditto-starter-puple">
<div className="relative w-[18px] h-[18px]">
<img
                className="absolute w-[53.68%] h-[52.99%] top-0 left-[46.32%]"
                alt="Vector"
                src="/img/vector.svg"
              />
<div className="absolute w-[84.08%] h-[78.23%] top-[21.76%] left-0">
<img
                  className="absolute w-[58.43%] h-full top-0 left-0"
                  alt="Vector"
                  src="/img/vector-1.svg"
                />
<img
                  className="absolute w-[33.33%] h-[44.81%] top-[41.93%] left-[66.67%]"
                  alt="Vector"
                  src="/img/vector-3.svg"
                />
</div>
</div>
<span className="relative flex items-center justify-center w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-ditto-colors-light-dark-ditto-background-white text-base tracking-[0] leading-4 whitespace-nowrap">
Create
            </span>
</button>
<div className="relative w-[51.76px] h-9">
<img
              className="absolute top-0 left-0 w-9 h-9 object-cover"
              alt="Ellipse"
              src="/img/ellipse-19.png"
            />
<img
              className="absolute top-4 left-[42px] w-2.5 h-[5px]"
              alt="Angle small down"
              src="/img/angle-small-down.svg"
            />
</div>
</div>
</header>
<div className="absolute top-[304px] left-[1012px] w-[140px] h-12 flex">
<button className="flex -mt-px w-[142px] h-[50px] -ml-px relative items-center justify-between px-[18px] py-3 rounded-md border border-solid border-ditto-colors-light-dark-ditto-border-grey">
<span className="relative w-fit [font-family:'Satoshi-Regular',Helvetica] font-normal text-ditto-colors-light-dark-ditto-text-fill text-sm tracking-[0] leading-[normal]">
By Status
          </span>
<img
            className="relative w-3 h-1.5 aspect-[1.95]"
            alt="Angle small down"
            src="/img/angle-small-down-3.svg"
          />
</button>
</div>
<h1 className="absolute top-[319px] left-32 [font-family:'Poppins',Helvetica] font-bold text-black text-[32px] tracking-[-0.96px] leading-[25px] whitespace-nowrap">
Stores
      </h1>

      {/* Plan-specific distribution options card */}
      <DistributionOptions plan={CURRENT_PLAN} />

<div className="flex flex-wrap w-[1020px] items-center gap-[16px_16px] absolute top-96 left-[calc(50.00%_-_512px)]">
{stores.map((store, index) => {
          const isFirstStore = index === 0;
          const hasRejectedStatus = store.status === "rejected";

          return (
            <div
              key={store.id}
              className={`relative ${
                isFirstStore ? "w-60" : "w-[242px]"
              } h-[100px] ${
                isFirstStore
                  ? "bg-ditto-colors-light-dark-ditto-light-grey rounded-xl shadow-[0px_0px_5px_#120b2e1a]"
                  : ""
              }`}
            >
{!isFirstStore && (
                <img
                  className="absolute top-[-5px] left-[-5px] w-[250px] h-[110px]"
                  alt="Rectangle"
                  src="/img/rectangle-1677.png"
                />
)}

              <div
                className={`flex flex-col ${
                  isFirstStore ? "w-[118px]" : "w-auto"
                } items-start gap-1 absolute ${
                  isFirstStore
                    ? "top-[31px] left-[75px]"
                    : "top-[34px] left-[75px]"
                }`}
              >
{index === 1 ? (
                  <img
                    className="absolute top-0 left-0 w-20 h-3.5"
                    alt={store.name}
                    src="/img/apple-music.png"
                  />
) : index === 2 ? (
                  <img
                    className="absolute top-0 left-1 w-[50px] h-[11px]"
                    alt={store.name}
                    src="/img/shazam.png"
                  />
) : index === 3 ? (
                  <img
                    className="absolute top-0 left-1 w-10 h-[11px]"
                    alt={store.name}
                    src="/img/itunes.png"
                  />
) : index === 4 ? (
                  <img
                    className="absolute top-0 left-0 w-[52px] h-[11px]"
                    alt={store.name}
                    src="/img/amazon.png"
                  />
) : index === 5 ? (
                  <img
                    className="absolute top-0 left-1 w-[63px] h-3.5"
                    alt={store.name}
                    src="/img/instagram.png"
                  />
) : index === 6 ? (
                  <img
                    className="absolute top-0 left-1 w-[63px] h-[11px]"
                    alt={store.name}
                    src="/img/facebook.png"
                  />
) : index === 7 ? (
                  <img
                    className="absolute top-0 left-1 w-[76px] h-[11px]"
                    alt={store.name}
                    src="/img/iheartradio.png"
                  />
) : index === 8 ? (
                  <img
                    className="absolute top-0 left-1 w-[53px] h-[11px]"
                    alt={store.name}
                    src="/img/pandora.png"
                  />
) : index === 9 ? (
                  <img
                    className="absolute top-0 left-1 w-7 h-[11px]"
                    alt={store.name}
                    src="/img/rdio.png"
                  />
) : index === 10 ? (
                  <img
                    className="absolute top-0 left-1 w-11 h-[11px]"
                    alt={store.name}
                    src="/img/deezer.png"
                  />
) : index === 11 ? (
                  <img
                    className="absolute top-0 left-0 w-[30px] h-[11px]"
                    alt={store.name}
                    src="/img/tidal.png"
                  />
) : index === 12 ? (
                  <img
                    className="absolute top-0 left-0 w-10 h-[11px]"
                    alt={store.name}
                    src="/img/tiktok.png"
                  />
) : index === 13 ? (
                  <img
                    className="absolute top-0 left-0 w-[95px] h-[11px]"
                    alt={store.name}
                    src="/img/youtube-music.png"
                  />
) : index === 14 ? (
                  <img
                    className="absolute top-0 left-1 w-[84px] h-[11px]"
                    alt={store.name}
                    src="/img/claro-musica.png"
                  />
) : index === 15 ? (
                  <img
                    className="absolute top-0 left-1 w-[77px] h-[11px]"
                    alt={store.name}
                    src="/img/joox.png"
                  />
) : index === 16 ? (
                  <img
                    className="absolute top-0 left-1 w-14 h-[11px]"
                    alt={store.name}
                    src="/img/joox-1.png"
                  />
) : index === 17 ? (
                  <img
                    className="absolute top-0 left-0 w-12 h-3.5"
                    alt={store.name}
                    src="/img/napster.png"
                  />
) : index === 18 ? (
                  <img
                    className="absolute top-0 left-1 w-[61px] h-3.5"
                    alt={store.name}
                    src="/img/saavn.png"
                  />
) : index === 19 ? (
                  <img
                    className="absolute top-0 left-1 w-[76px] h-[11px]"
                    alt={store.name}
                    src="/img/boomplay.png"
                  />
) : index === 20 ? (
                  <img
                    className="absolute top-[-10px] left-0 w-[74px] h-[33px]"
                    alt={store.name}
                    src="/img/huawei.png"
                  />
) : index === 21 ? (
                  <img
                    className="absolute top-0 left-1 w-[25px] h-[11px]"
                    alt={store.name}
                    src="/img/awa.png"
                  />
) : index === 22 ? (
                  <img
                    className="absolute top-0 left-0 w-[58px] h-3.5"
                    alt={store.name}
                    src="/img/resso.png"
                  />
) : index === 23 ? (
                  <img
                    className="absolute top-0 left-1 w-[47px] h-[11px]"
                    alt={store.name}
                    src="/img/napster-1.png"
                  />
) : index === 24 ? (
                  <img
                    className="absolute top-0 left-1 w-[51px] h-[11px]"
                    alt={store.name}
                    src="/img/huawei-1.png"
                  />
) : index === 25 ? (
                  <img
                    className="absolute top-0 left-0 w-12 h-[11px]"
                    alt={store.name}
                    src="/img/saavn-1.png"
                  />
) : index === 26 ? (
                  <img
                    className="absolute top-0 left-1 w-[38px] h-[11px]"
                    alt={store.name}
                    src="/img/saavn-2.png"
                  />
) : index === 27 ? (
                  <img
                    className="absolute top-0 left-1 w-[46px] h-[11px]"
                    alt={store.name}
                    src="/img/joox-2.png"
                  />
) : index === 28 ? (
                  <img
                    className="absolute top-0 left-1 w-[37px] h-[11px]"
                    alt={store.name}
                    src="/img/resso-1.png"
                  />
) : (
                  <span
                    className={`relative ${
                      isFirstStore ? "self-stretch mt-[-1.75px] ml-[-0.75px]" : ""
                    } [-webkit-text-stroke:1.5px_#0e112c] [font-family:'Satoshi-Regular',Helvetica] font-normal text-ditto-colors-light-dark-ditto-text-fill text-[15px] tracking-[0] leading-[22px]`}
                  >
{store.name}
                  </span>
)}

                <div
                  className={`flex relative ${
                    isFirstStore ? "self-stretch w-full" : ""
                  } flex-[0_0_auto] items-center gap-1.5 ${
                    index === 1 ? "absolute top-[24px] left-0" : ""
                  } ${index === 20 ? "absolute top-[42px] left-0" : ""}`}
                >
<div
                    className="relative w-3 h-3 rounded-md"
                    style={{ backgroundColor: store.statusColor }}
                  />
{hasRejectedStatus ? (
                    <>
{index === 1 && (
                        <img
                          className="relative w-3.5 h-4 aspect-[0.86]"
                          alt="Group"
                          src="/img/group-4496-2.png"
                        />
)}
                      <img
                        className="relative w-[43.68px] h-[11.4px] mb-[-1.65px]"
                        alt="Windswept single by"
                        src="/img/windswept-single-by-crywolf-2.png"
                      />
</>
) : (
                    <img
                      className="relative w-[22.78px] h-[8.89px] mb-[-1.14px]"
                      alt="Windswept single by"
                      src="/img/windswept-single-by-crywolf-27.png"
                    />
)}
                </div>
</div>
{index === 0 && (
                <img
                  className="absolute w-12 h-12 top-[25px] left-[15px]"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 1 && (
                <>
<div className="absolute w-[19.83%] h-[48.00%] top-[25.00%] left-[6.20%] opacity-50 bg-[url(/img/path-3179.svg)] bg-[100%_100%]" />
<div className="absolute w-[26px] h-[33px] top-8 left-6 bg-[url(/img/path-3180.svg)] bg-[100%_100%]" />
</>
)}

              {index === 2 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 3 && (
                <div className="opacity-50 bg-[url(/img/rectangle-951.png)] bg-cover bg-[50%_50%] absolute top-[25px] left-[15px] w-12 h-12" />
)}

              {index === 4 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 5 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Instagram logo"
                  src={store.icon}
                />
)}

              {index === 6 && (
                <div className="absolute top-[25px] left-[15px] w-12 h-12 bg-[url(/img/rectangle-992.svg)] bg-[100%_100%]">
<div className="relative w-[42.42%] h-[80.00%] top-[20.00%] left-[28.79%] bg-[url(/img/path-4134.svg)] bg-[100%_100%]" />
</div>
)}

              {index === 7 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 8 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 9 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 10 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Frame"
                  src={store.icon}
                />
)}

              {index === 11 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 12 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 13 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12"
                  alt="Spotify icon"
                  src={store.icon}
                />
)}

              {index === 14 && (
                <img
                  className="absolute top-[22px] left-[15px] w-12 h-12"
                  alt="Claro musica icon"
                  src={store.icon}
                />
)}

              {index === 15 && (
                <img
                  className="absolute top-[26px] left-[15px] w-12 h-12"
                  alt="Group"
                  src={store.icon}
                />
)}

              {index === 16 && (
                <img
                  className="absolute w-[50px] h-[50px] top-[25px] left-[15px]"
                  alt="Group"
                  src={store.icon}
                />
)}

              {index === 17 && (
                <img
                  className="absolute top-[25px] left-[15px] w-12 h-12 object-cover"
                  alt="Image"
                  src={store.icon}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
