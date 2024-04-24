import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import { getLinkWithSearchParams } from "../../_utils/routes";
import { PageViewTop } from "../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { CTACard } from "../_components/HeroCard/CTACard";
import { MoreNavCard } from "./_components/MoreNavCard";
import { getDynamicPageMetadata } from "../../_utils/site";

import * as S from "./_components/more.css";

export default async function More({ searchParams }: RouterStruct) {
  return (
    <>
      <PageViewTop page="More" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <div className={S.main}>
        <MoreNavCard title="About us" description="Making staking easy for everyone" url="#" />
        <MoreNavCard title="How it works" description="Staking optimizer, compounder, and more" url="#" />
        <MoreNavCard title="FAQ" description="Frequent questions" url="#" />
      </div>

      <WidgetBottomBox>
        <CTACard topSubtitle="App version" title="v0.0.1" />
      </WidgetBottomBox>
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "More", networkParam: searchParams?.network });
}
