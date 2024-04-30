import type { Metadata } from "next";
import type { RouterStruct } from "../../types";
import { getLinkWithSearchParams } from "../../_utils/routes";
import { getLatestReleaseTag } from "../../_services/gitHub";
import { PageViewTop } from "../_components/WidgetTop";
import { WidgetBottomBox } from "@/app/_components/WidgetBottomBox";
import { CTACard } from "../_components/HeroCard/CTACard";
import { MoreNavCard } from "./_components/MoreNavCard";
import { getDynamicPageMetadata } from "../../_utils/site";
import * as S from "./_components/more.css";

export default async function More({ searchParams }: RouterStruct) {
  const latestReleaseTag = await getLatestReleaseTag();

  return (
    <>
      <PageViewTop page="More" homeURL={getLinkWithSearchParams(searchParams, "")} />
      <ul className={S.main}>
        <li>
          <MoreNavCard
            title="About us"
            description="Making staking easy for everyone"
            url={process.env.NEXT_PUBLIC_ABOUT_US_LINK}
          />
        </li>
        <li>
          <MoreNavCard
            title="How it works"
            description="Staking optimizer, compounder, and more"
            url={process.env.NEXT_PUBLIC_HOW_IT_WORKS_LINK}
          />
        </li>
        <li>
          <MoreNavCard title="FAQ" description="Frequent questions" url={process.env.NEXT_PUBLIC_FAQ_LINK} />
        </li>
      </ul>

      <WidgetBottomBox>
        <CTACard topSubtitle="App version" title={latestReleaseTag} />
      </WidgetBottomBox>
    </>
  );
}

export async function generateMetadata({ searchParams }: RouterStruct): Promise<Metadata> {
  return getDynamicPageMetadata({ page: "More", networkParam: searchParams?.network });
}
