"use client";
import type { RouterStruct } from "../../../types";
import { getLinkWithSearchParams } from "../../../_utils/routes";
import { StakingProvider } from "../../../_contexts/StakingContext";
import { PageViewTop } from "../../_components/WidgetTop";
import { AboutUsNavCard } from "./AboutUsNavCard";
import { HowItWorksNavCard } from "./HowItWorksNavCard";
import { FAQNavCard } from "./FAQNavCard";
import { BottomBox } from "@/app/_components/BottomBox";
import { CTACard } from "../../_components/HeroCard/CTACard";

export const ClientSideMorePage = ({ searchParams }: { searchParams: RouterStruct["searchParams"] }) => {
  return (
    <StakingProvider>
      <PageViewTop page="More" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <AboutUsNavCard searchParams={searchParams} />
      <HowItWorksNavCard searchParams={searchParams} />
      <FAQNavCard searchParams={searchParams} />

      <BottomBox>
        <CTACard topSubtitle="App version" title="v0.0.1" />
      </BottomBox>
    </StakingProvider>
  );
};
